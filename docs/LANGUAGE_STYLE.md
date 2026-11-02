# Bureau language standard — Russian at first glance

**Creative direction approved by owner, 2 November 2026.** This is an intentional fictional written dialect for **БЮРОКЯДТ-1**, not a Russian translation and not a random letter-substitution filter.

## The three-glance joke

1. **First glance:** a passerby assumes the signage and interface are Russian. Use real Cyrillic institutional headings, uppercase, official typography and frequent Cyrillic lookalikes.
2. **Second glance:** an English-speaking operator notices that many words are understandable corrupted English. Vary shortening, extra syllables, occasional missing letters, office shorthand, and visually similar Cyrillic characters.
3. **Third glance:** the completely unnecessary procedure becomes legible and funny. Keep the action sequence obvious and the humor deadpan.

## Two different linguistic materials

**Actual Russian must always be written in real Cyrillic, uncorrupted and correctly spelled.** Examples: `МЕНЮ`, `РЕЖИМ`, `КОМИССИЯ`, `МИНИСТЕРСТВО`, `ТОВАРИЩ`, `ДОКУМЕНТ`, `НЕТ ДОКУМЕНТА`, `ПРОВЕРКА`, `ГОТОВО`, `СПРАВКА`, `ПЕЧАТЬ`. Never write NYET, SPRAVKA, TOVARISHCH or a half-Latin spelling when the intended word is authentic Russian.

**Invented English may be misspelled and mixed-script**, e.g. `SЕLЕКТ` (select/selekt), `КОNFIRM` (confirm/konfirm), `РRОЦЕSSING` (processing), `АPРRОVД` (approved), `РЕRМIТ` (permit), `МЕNЮ` (menu). Those are invented bureaucratic English tokens, *not* Russian words. Unusual characters are a discretionary visual ingredient, not a global replace-all transformation. Ordinary capital `I` is retained. For Russian-at-first-glance typography, do not use Ukrainian `Ї` or `Є` as decorative English I or E; prefer real Russian Cyrillic where a match is needed.

Aim for a mix of official authentic Russian on the machine, more aggressive hybrid typography on compact display labels, and lighter corruption in long functional explanations. Preserve recognizable English word shapes, control hotkeys and short verbs even when most of the glyphs look Cyrillic. Avoid nonsensical character replacements that destroy a word's outline.

### Example copy / rationale

| Ordinary meaning | Visible bureau lettering | Why |
| --- | --- | --- |
| Select document | `SЕLЕКТ ДОКУМЕНТ` | Familiar English verb and real Russian object |
| Confirm | `КОNFIRM` | A bureaucratic transliteration-like English invention, not a Russian word |
| Processing | `РRОЦЕSSING` | First-glance Cyrillic, recoverable English |
| Collect certificate | `СОLLЕКТ СПРАВКА` | English verb, real Russian administrative noun |
| No document | `НЕТ ДОКУМЕНТА` | Proper Russian phrase in its context |
| Photo mode | `ФОТО РЕЖИМ` | Two ordinary Russian words, deducible from the camera context |
| Approved | `АPРRОVД` | Shrunken/spliced English with a Cyrillic-style ending |

The sample phrases are copy decisions, not a transliteration dictionary. Reuse terms consistently at critical interaction points; vary surrounding ministry prose where it feels intentionally institutional. The existing original physical Russian labels, red stamp, certificate, and posters are the authentic backbone and must not be unintentionally converted.

## Accessibility, privacy and correctness

- Visual copy is decorative. Action `aria-label` values and dialog names remain readable plain English. `#hint` and `#cinemaStatus` are visually displayed but `aria-hidden`, with respective independent plain-English live regions `#srStatus` and `#srCinemaStatus`. The modal help has plain-English accessible equivalents.
- **Never transform the user's filename**, its case/extension, the saved certificate filename, downloadable output path, local storage, URL, HTML ID, JS identifier, source code token, keyboard shortcut, or PWA manifest text. This language is for displayed authored copy only.
- Review real fonts and text widths at narrow mobile size, landscape and desktop. Long blocks must remain understood after close inspection. Native Russian words remain valid Cyrillic even if the sentence uses fictional English grammar.
- Add or update checks whenever key actions or status copy changes: `node tests/language-style.mjs`, the actual `tests/ui-accessibility.mjs` and `tests/acceptance.mjs` browser paths when available. Screen-reader behavior requires real manual review before any claim of device/accessibility certification.
- The current illustration does not certify owner aesthetic acceptance; it is a candidate until the integrated game is reviewed. The separate open issue #16 also touches a previous dotted-I typo and planned release metadata; rebase and reconcile versions before any authorized merge.

For mixed-script confusables in general text, see the [Unicode FAQ on Latin and Cyrillic scripts](https://unicode.org/faq/latin_cyrillic.html). Here the ambiguity is confined to fictional decorative copy, not security-sensitive identifiers.
