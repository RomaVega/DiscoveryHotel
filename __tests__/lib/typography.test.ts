import { describe, it, expect } from "vitest";
import { bindShortWords, joinSlashes, longestTitleLine, splitTitle } from "@/lib/typography";

describe("splitTitle", () => {
  it.each([
    ["Ayurvedic Spa", ["Ayurvedic", "Spa"]],
    ["Diving & Snorkeling", ["Diving &", "Snorkeling"]],
    ["Events & Celebrations", ["Events &", "Celebrations"]],
    ["Car & Bike Rental", ["Car & Bike", "Rental"]],
    ["Signature Excursions", ["Signature", "Excursions"]],
    ["Tours & Activities", ["Tours &", "Activities"]],
  ])("sets the English title %s on two balanced lines", (title, lines) => {
    expect(splitTitle(title)).toEqual(lines);
  });

  it.each([
    ["Аюрведический Спа", ["Аюрведический", "Спа"]],
    ["Дайвинг и Снорклинг", ["Дайвинг", "и Снорклинг"]],
    ["Мероприятия и Торжества", ["Мероприятия", "и Торжества"]],
    ["Аренда Авто/Мото", ["Аренда", "Авто/Мото"]],
    ["Авторские Экскурсии", ["Авторские", "Экскурсии"]],
    ["Туры и активности", ["Туры", "и активности"]],
  ])("keeps Russian conjunctions with the next word: %s", (title, lines) => {
    expect(splitTitle(title)).toEqual(lines);
  });

  it("never ends a line on a preposition, even when that would balance better", () => {
    // "Ужин у" / "бассейна" would be more even (8 characters against 10).
    expect(splitTitle("Ужин у бассейна")).toEqual(["Ужин", "у бассейна"]);
  });

  it("returns a one-word title as a single line", () => {
    expect(splitTitle("Spa")).toEqual(["Spa"]);
  });

  it("returns a single line when no break is allowed", () => {
    expect(splitTitle("и Спа")).toEqual(["и Спа"]);
  });

  it("collapses stray whitespace", () => {
    expect(splitTitle("  Ayurvedic   Spa ")).toEqual(["Ayurvedic", "Spa"]);
  });
});

describe("longestTitleLine", () => {
  it("measures the longer of the two lines the tile will set", () => {
    expect(longestTitleLine("Аюрведический Спа")).toBe(13);
    expect(longestTitleLine("Car & Bike Rental")).toBe(10);
  });
});

describe("joinSlashes", () => {
  it("glues the halves of a slashed pair so the line cannot break after the slash", () => {
    expect(joinSlashes("Авто/Мото")).toBe("Авто/⁠Мото");
  });
});

describe("bindShortWords", () => {
  const NBSP = " ";
  it("glues a one-letter Russian preposition or conjunction to the next word", () => {
    expect(bindShortWords("Ресторан у Моря")).toBe(`Ресторан у${NBSP}Моря`);
    expect(bindShortWords("Дайвинг и Снорклинг")).toBe(`Дайвинг и${NBSP}Снорклинг`);
    expect(bindShortWords("Шаттл на Пляж")).toBe(`Шаттл на${NBSP}Пляж`);
  });
  it("keeps an ampersand with the word before it", () => {
    expect(bindShortWords("Diving & Snorkeling")).toBe(`Diving${NBSP}& Snorkeling`);
  });
  it("leaves ordinary labels alone", () => {
    expect(bindShortWords("Swimming Pool")).toBe("Swimming Pool");
    expect(bindShortWords("Бассейн")).toBe("Бассейн");
  });
});
