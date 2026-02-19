const fullInput = document.getElementById("fullInput");
const halfInput = document.getElementById("halfInput");
const fullCopyBtn = document.getElementById("fullCopyBtn");
const halfCopyBtn = document.getElementById("halfCopyBtn");

const fullToHalfMap = {
  "。": "｡",
  "「": "｢",
  "」": "｣",
  "、": "､",
  "・": "･",
  "ー": "ｰ",
  "ヲ": "ｦ",
  "ァ": "ｧ",
  "ィ": "ｨ",
  "ゥ": "ｩ",
  "ェ": "ｪ",
  "ォ": "ｫ",
  "ャ": "ｬ",
  "ュ": "ｭ",
  "ョ": "ｮ",
  "ッ": "ｯ",
  "ア": "ｱ",
  "イ": "ｲ",
  "ウ": "ｳ",
  "エ": "ｴ",
  "オ": "ｵ",
  "カ": "ｶ",
  "キ": "ｷ",
  "ク": "ｸ",
  "ケ": "ｹ",
  "コ": "ｺ",
  "サ": "ｻ",
  "シ": "ｼ",
  "ス": "ｽ",
  "セ": "ｾ",
  "ソ": "ｿ",
  "タ": "ﾀ",
  "チ": "ﾁ",
  "ツ": "ﾂ",
  "テ": "ﾃ",
  "ト": "ﾄ",
  "ナ": "ﾅ",
  "ニ": "ﾆ",
  "ヌ": "ﾇ",
  "ネ": "ﾈ",
  "ノ": "ﾉ",
  "ハ": "ﾊ",
  "ヒ": "ﾋ",
  "フ": "ﾌ",
  "ヘ": "ﾍ",
  "ホ": "ﾎ",
  "マ": "ﾏ",
  "ミ": "ﾐ",
  "ム": "ﾑ",
  "メ": "ﾒ",
  "モ": "ﾓ",
  "ヤ": "ﾔ",
  "ユ": "ﾕ",
  "ヨ": "ﾖ",
  "ラ": "ﾗ",
  "リ": "ﾘ",
  "ル": "ﾙ",
  "レ": "ﾚ",
  "ロ": "ﾛ",
  "ワ": "ﾜ",
  "ン": "ﾝ",
  "ヵ": "ｶ",
  "ヶ": "ｹ",
  "ヮ": "ﾜ",
  "ヰ": "ｲ",
  "ヱ": "ｴ",
  "゛": "ﾞ",
  "゜": "ﾟ"
};

function toKatakana(text) {
  return text.replace(/[\u3041-\u309f]/g, (char) => {
    const code = char.codePointAt(0);
    return String.fromCodePoint(code + 0x60);
  });
}

function convertFullToHalf(text) {
  const katakana = toKatakana(text);
  let result = "";

  for (const char of katakana) {
    const decomposed = char.normalize("NFD");

    for (const part of decomposed) {
      if (part === "\u3099" || part === "゛") {
        result += "ﾞ";
        continue;
      }
      if (part === "\u309a" || part === "゜") {
        result += "ﾟ";
        continue;
      }
      result += fullToHalfMap[part] ?? part;
    }
  }

  return result;
}

function convertHalfToFull(text) {
  return text.replace(/[｡-ﾟ]+/g, (segment) => segment.normalize("NFKC"));
}

function syncFromFull() {
  halfInput.value = convertFullToHalf(fullInput.value);
}

function syncFromHalf() {
  fullInput.value = convertHalfToFull(halfInput.value);
}

function copyByFallback(text) {
  const temp = document.createElement("textarea");
  temp.value = text;
  temp.setAttribute("readonly", "");
  temp.style.position = "fixed";
  temp.style.top = "-9999px";
  document.body.appendChild(temp);
  temp.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(temp);
  if (!copied) {
    throw new Error("copy failed");
  }
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  copyByFallback(text);
}

function attachCopy(button, source) {
  button.addEventListener("click", async () => {
    const baseLabel = "コピー";

    try {
      await copyText(source.value);
      button.textContent = "コピー済み";
    } catch {
      button.textContent = "失敗";
    }

    setTimeout(() => {
      button.textContent = baseLabel;
    }, 900);
  });
}

fullInput.addEventListener("input", syncFromFull);
halfInput.addEventListener("input", syncFromHalf);
attachCopy(fullCopyBtn, fullInput);
attachCopy(halfCopyBtn, halfInput);

syncFromFull();
