"""Original deterministic sound design. Requires numpy, scipy and ffmpeg.

No downloaded samples. Modal impacts, filtered mechanical noise and an original
64-second D-minor chamber-industrial score; kept quiet by the browser mixer.
"""
from pathlib import Path
import subprocess
import tempfile
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 32000
RNG = np.random.default_rng(1982)
OUT = Path(__file__).resolve().parents[1] / 'assets' / 'audio'
OUT.mkdir(parents=True, exist_ok=True)

def low(x, hz):
    return signal.sosfilt(signal.butter(2, hz, fs=SR, output='sos'), x)

def band(x, lo, hi):
    return signal.sosfilt(signal.butter(2, [lo, hi], btype='bandpass', fs=SR, output='sos'), x)

def time(d):
    return np.arange(round(SR*d)) / SR

def impact(d=.8, depth=80, strength=1):
    t=time(d)
    x=low(RNG.normal(0,1,len(t)),2100)*np.exp(-t*55)*.5
    for f,a,dec in [(depth,1,14),(depth*2.41,.22,8),(depth*4.93,.12,11),(1173,.05,20)]:
        x+=a*np.sin(2*np.pi*f*t)*np.exp(-t*dec)
    return x*strength

def save(name,x,loop=False):
    if x.ndim==1:
        x=np.column_stack((x,np.roll(x,97)*.92))
    # Short room reflections are audible as materials, not arcade oscillators.
    wet=x.copy()
    for delay,gain in [(.039,.12),(.077,.08),(.131,.045)]:
        n=int(delay*SR)
        if loop: wet+=np.roll(x,n,axis=0)*gain
        else: wet[n:]+=x[:-n]*gain
    peak=np.max(np.abs(wet));wet=wet/max(peak,1e-6)*.78
    with tempfile.TemporaryDirectory() as td:
        wav=Path(td)/'source.wav';wavfile.write(wav,SR,(wet*32767).astype(np.int16))
        subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(wav),'-c:a','libvorbis','-q:a','3',str(OUT/(name+'.ogg'))],check=True)

save('relay',impact(.38,192,.7)+np.pad(impact(.32,420,.25),(round(.06*SR),0)))
save('stamp',impact(1.3,61,1)+np.pad(impact(1.16,186,.26),(round(.14*SR),0)))
t=time(1.85);speed=1-np.exp(-t*18);env=np.minimum(t/.1,1)*np.minimum((1.85-t)/.16,1)
feed=(band(RNG.normal(0,1,len(t)),250,4300)*.15*(.6+.4*np.sin(2*np.pi*23*t)**2)+low(RNG.normal(0,1,len(t)),170)*.5)
feed+=.065*np.sin(2*np.pi*(82*t-2*np.exp(-t*15)))+.025*np.sin(2*np.pi*164*t)
save('feed',feed*env)
t=time(1.50);env=np.sin(np.pi*np.minimum(t/1.5,1))**.5
scan=band(RNG.normal(0,1,len(t)),450,2900)*.065
scan+=.025*np.sin(2*np.pi*(231*t+21*t*t))+.017*np.sin(2*np.pi*503*t)
save('scan',scan*env)
t=time(1.7);bell=sum(a*np.sin(2*np.pi*f*t)*np.exp(-t*d) for f,a,d in [(641,1,4.8),(1732,.3,6),(2920,.14,9)])
save('bell',bell*(1-np.exp(-t*400)))
t=time(8);hum=.07*np.sin(2*np.pi*50*t)+.018*np.sin(2*np.pi*100*t)+low(RNG.normal(0,1,len(t)),380)*.10
fade=int(.15*SR);hum[:fade]*=np.linspace(0,1,fade);hum[-fade:]*=np.linspace(1,0,fade)
save('room',hum,loop=True)

DUR=64;mix=np.zeros((DUR*SR,2));
def hz(midi): return 440*2**((midi-69)/12)
def put(x,start,level=.1,pan=0):
    i=int(start*SR);ids=(i+np.arange(len(x)))%len(mix)
    mix[ids,0]+=x*level*np.sqrt((1-pan)/2);mix[ids,1]+=x*level*np.sqrt((1+pan)/2)

def bowed(midi,d,brass=False):
    t=time(d);f=hz(midi);x=np.zeros(len(t));vib=.003*np.sin(2*np.pi*4.7*t)
    for detune in [-.0018,.0013]:
        phase=2*np.pi*f*(1+detune)*t+.02*np.sin(2*np.pi*4.7*t)
        for k in range(1,15 if brass else 10):
            a=np.exp(-k/(3.3 if brass else 2.4))/k**(.55 if brass else 1.05)
            x+=a*np.sin(k*phase+RNG.uniform(0,6.28))
    x+=band(RNG.normal(0,1,len(t)),300,2200)*(.012 if brass else .025)
    env=np.minimum(t/(1.7 if brass else 2.8),1)*np.minimum((d-t)/3.3,1)
    return low(x,1700 if brass else 2200)*env*(.94+.06*np.sin(2*np.pi*.13*t))

# Four slowly changing 16-second harmonies. The fifth never resolves triumphantly.
for j,chord in enumerate([(38,45,53,57),(34,41,50,57),(31,43,50,58),(33,40,49,58)]):
    for n,m in enumerate(chord):put(bowed(m,19),j*16,.082 if n<2 else .035,(n-1.5)*.34)
    put(bowed(chord[0]+12,10,True),j*16+5,.045,-.2)
# Sparse original motif, deliberately more empty space than melody.
for start,midi,d in [(2,69,5),(9,65,5),(19,62,5),(26,64,4),(35,65,5),(42,62,5),(51,61,5),(58,64,4)]:
    t=time(d);x=np.sin(2*np.pi*hz(midi)*t)*np.exp(-t*1.45)
    x+=.23*np.sin(2*np.pi*hz(midi)*2.01*t)*np.exp(-t*2.3)
    x+=.08*np.sin(2*np.pi*hz(midi)*3.98*t)*np.exp(-t*4)
    x*=1-np.exp(-t*100);put(x,start,.05,.35)
for start in [0,8,16,24,32,40,48,56]:put(impact(3,43,.5),start,.085,0)
for start in [14,30,46,62]:
    t=time(5);x=sum(a*np.sin(2*np.pi*f*t)*np.exp(-t*d) for f,a,d in [(174,.3,1),(422,.12,.8),(871,.05,1.5)])
    put(x*(1-np.exp(-t*40)),start,.055,-.55)
# Circular diffuse reverb preserves the loop seam, including tails from bar four.
dry=mix.copy()
for delay,amp in [(.173,.2),(.317,.17),(.479,.13),(.733,.10),(1.13,.07),(1.71,.035)]:
    mix+=np.roll(dry,int(delay*SR),axis=0)[:,::-1]*amp
save('ministry',mix,loop=True)
print('Wrote original score and six mechanical/room assets:',sum(p.stat().st_size for p in OUT.glob('*.ogg')),'bytes')
