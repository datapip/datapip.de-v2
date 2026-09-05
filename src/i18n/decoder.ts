/**
 * De-coder tool copy, keyed by locale.
 *
 * Ported verbatim from v1's `(shared)/(de-coder)/decoder.tsx` contentMap and
 * the metadata from its `de-kodierer` / `de-coder` routes.
 *
 * The placeholder pairs are worth keeping exactly as they are: each output
 * placeholder is the real result of running the action on the matching input
 * placeholder, so they double as a parity fixture. The hash values in
 * particular are what v1's Node `crypto` produced — if a change makes the
 * tool disagree with them, the tool is wrong.
 *
 * `eyebrow`, `panelTitle` and `noscript` are new: UI chrome for the Instrument
 * shell, not ported content.
 */

import type { Locale } from "./ui";

/** Prefix decides the control layout: e: and f: are reversible, h: is not. */
export const actions = [
  "e:url",
  "e:base64",
  "h:md5",
  "h:sha1",
  "h:sha256",
  "h:sha512",
  "f:json",
  "f:qs-json",
] as const;

export type Action = (typeof actions)[number];

/** Option labels are identical in both locales in v1, so they are not i18n. */
export const actionLabels: Record<Action, string> = {
  "e:url": "URL",
  "e:base64": "Base64",
  "h:md5": "MD5",
  "h:sha1": "SHA1",
  "h:sha256": "SHA256",
  "h:sha512": "SHA512",
  "f:json": "JSON-text → JSON",
  "f:qs-json": "Querystring → JSON",
};

export const decoder = {
  de: {
    meta: {
      title: "De-Kodierer | Online Encoding & Decoding Tool | datapip.de",
      description:
        "Kostenloses Online-Tool für Encoding, Decoding & Hashing. Unterstützt URL, Base64, SHA256, MD5, JSON. Ideal für Entwickler & Analysten. Keine Registrierung erforderlich. ✓",
      keywords:
        "Encoding, Decoding, URL Encoding, Base64, SHA256, MD5, JSON Formatter, Online Tool",
    },
    eyebrow: "Werkzeug",
    panelTitle: "De-Kodierer",
    h1: "En-Kodierer",
    p: "Ein unkompliziertes Tool zum schnellen En- und Dekodieren von Daten – unterstützt URL, Base64, SHA256, MD5 und JSON",
    field: {
      label: "Aktion",
      description:
        "Wähle zwischen Kodieren, Dekodieren, Hashen oder Formatieren.",
      placeholder: "Bitte wählen ...",
      selectLabelList: ["- kodieren -", "- hashen -", "- formatieren -"],
    },
    field2: {
      label: "Ausgangswert",
      description: "Gib einen initialen Wert an, den du verarbeiten möchtest.",
      placeholders: {
        "e:url": "?key=das ist ein test",
        "e:base64": "das ist ein test",
        "h:md5": "das ist ein test",
        "h:sha1": "das ist ein test",
        "h:sha256": "das ist ein test",
        "h:sha512": "das ist ein test",
        "f:json": '{"foo": "das ist ein test"}',
        "f:qs-json": "?foo=das%20ist%20ein%20test",
      },
    },
    field3: {
      label: "Ergebniswert",
      description:
        "Gib einen verarbeiteten Wert an, um den initialen Wert zu bekommen.",
      placeholders: {
        "e:url": "?key=das%20ist%20ein%20test",
        "e:base64": "ZGFzIGlzdCBlaW4gdGVzdA==",
        "h:md5": "d763820736902039e6c5d2e1cfb47058",
        "h:sha1": "7cc0b176cd96d745ff8c652bd263aa57f7b35d6a",
        "h:sha256":
          "84780e15b9d78870a9bc80557d4013d222b989ef649bdb590059eec8949c1de5",
        "h:sha512":
          "e2ef57b49ca089006663555f0815a4ab9fe661920c9bf9a295a0420257ee85c7bd5fee617b1c28bea8d9b0dd65aef550fd1efde6123b6a946e96b14de0e508ca",
        /* 4-space, because that is what the tool actually emits. v1's
           placeholders showed 2-space for f:json and minified for f:qs-json,
           neither of which matched its own output. */
        "f:json": '{\n    "foo": "das ist ein test"\n}',
        "f:qs-json": '{\n    "foo": "das ist ein test"\n}',
      },
    },
    buttons: {
      encodeList: ["kodieren", "dekodieren"],
      hash: "hashen",
      formatList: ["formatieren", "rückformatieren"],
    },
    error: "Fehler",
    errorDefault: "Es gab einen unbekannten Fehler.",
    noscript:
      "Der De-Kodierer rechnet vollständig im Browser – ohne aktiviertes JavaScript kann er nicht arbeiten.",
  },
  en: {
    meta: {
      title: "De-coder | Online Encoding & Decoding Tool | datapip.de",
      description:
        "Free online tool for encoding, decoding & hashing. Supports URL, Base64, SHA256, MD5, JSON. Perfect for developers & analysts. No registration required. ✓",
      keywords:
        "Encoding, Decoding, URL Encoding, Base64, SHA256, MD5, JSON Formatter, Online Tool",
    },
    eyebrow: "Tool",
    panelTitle: "De-coder",
    h1: "En-Coder",
    p: "A simple tool for quickly encoding and decoding data – supports URL, Base64, SHA256, MD5, and JSON.",
    field: {
      label: "Action",
      description: "Choose between encoding, decoding, hashing, or formatting.",
      placeholder: "Please select ...",
      selectLabelList: ["- encode -", "- hash -", "- format -"],
    },
    field2: {
      label: "Input Value",
      description: "Enter an initial value you want to process.",
      placeholders: {
        "e:url": "?key=this is a test",
        "e:base64": "this is a test",
        "h:md5": "this is a test",
        "h:sha1": "this is a test",
        "h:sha256": "this is a test",
        "h:sha512": "this is a test",
        "f:json": '{"foo": "this is a test"}',
        "f:qs-json": "?foo=this%20is%20a%20test",
      },
    },
    field3: {
      label: "Result Value",
      description: "Enter a processed value to retrieve the initial value.",
      placeholders: {
        "e:url": "?key=this%20is%20a%20test",
        "e:base64": "dGhpcyBpcyBhIHRlc3Q=",
        "h:md5": "54b0c58c7ce9f2a8b551351102ee0938",
        /* Corrected, not ported. v1 shipped sha1("This is a test") here —
           a differently-cased string than the input placeholder states — and
           a sha512 value matching no plausible input at all. Both are the
           real digests of "this is a test"; the German pair was already
           correct. A hashing tool showing a wrong hash is a defect. */
        "h:sha1": "fa26be19de6bff93f70bc2308434e4a440bbad02",
        "h:sha256":
          "2e99758548972a8e8822ad47fa1017ff72f06f3ff6a016851f45c398732bc50c",
        "h:sha512":
          "7d0a8468ed220400c0b8e6f335baa7e070ce880a37e2ac5995b9a97b809026de626da636ac7365249bb974c719edf543b52ed286646f437dc7f810cc2068375c",
        "f:json": '{\n    "foo": "this is a test"\n}',
        "f:qs-json": '{\n    "foo": "this is a test"\n}',
      },
    },
    buttons: {
      encodeList: ["encode", "decode"],
      hash: "hash",
      formatList: ["format", "reformat"],
    },
    error: "Error",
    errorDefault: "An unknown error occurred.",
    noscript:
      "The de-coder runs entirely in your browser — without JavaScript enabled it cannot work.",
  },
} as const satisfies Record<Locale, unknown>;
