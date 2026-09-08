import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildLangRedirectScript,
  enPathsWithRuTwin,
  LANG_PREF_KEY,
} from "@/lib/lang-redirect";

// A synthetic manifest: two translated routes plus /press, standing in for an
// EN-only page. Every real route has a Russian twin today, so this branch has
// no live example — which is exactly why it needs a test.
const ROUTES = ["/", "/rooms", "/press", "/ru", "/ru/rooms"];
const SCRIPT = buildLangRedirectScript(enPathsWithRuTwin(ROUTES));

const replace = vi.fn();

/** Point the script at a URL, then execute the exact string that ships. */
function runAt(url: string) {
  const u = new URL(`https://orlowsky.id${url}`);
  Object.defineProperty(window, "location", {
    configurable: true,
    value: {
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      replace,
    },
  });
  new Function(SCRIPT)();
}

function setPrimaryLanguage(lang: string, rest: string[] = []) {
  Object.defineProperty(navigator, "languages", {
    configurable: true,
    get: () => [lang, ...rest],
  });
  Object.defineProperty(navigator, "language", {
    configurable: true,
    get: () => lang,
  });
}

describe("enPathsWithRuTwin", () => {
  it("maps the Russian routes back to their English paths", () => {
    expect(enPathsWithRuTwin(ROUTES)).toEqual(["/", "/rooms"]);
  });

  it("omits pages with no Russian version", () => {
    expect(enPathsWithRuTwin(ROUTES)).not.toContain("/press");
  });
});

describe("language redirect script", () => {
  beforeEach(() => {
    replace.mockClear();
    localStorage.clear();
    setPrimaryLanguage("en-US");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("first visit, no stored preference", () => {
    it("sends a Russian browser to the Russian home page", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/");
      expect(replace).toHaveBeenCalledWith("/ru");
    });

    it("sends a Russian browser to the matching inner page", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms");
      expect(replace).toHaveBeenCalledWith("/ru/rooms");
    });

    it("accepts a bare 'ru' as well as a region-tagged one", () => {
      setPrimaryLanguage("ru");
      runAt("/rooms");
      expect(replace).toHaveBeenCalledWith("/ru/rooms");
    });

    it("leaves an English browser alone", () => {
      runAt("/rooms");
      expect(replace).not.toHaveBeenCalled();
    });

    it("leaves a page with no Russian twin alone", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/press");
      expect(replace).not.toHaveBeenCalled();
    });

    it("does not route on a merely secondary Russian preference", () => {
      // en-US first means the browser will not offer to translate an English
      // page, so there is nothing to prevent — and /ru would invite the
      // reverse offer.
      setPrimaryLanguage("en-US", ["ru-RU"]);
      runAt("/rooms");
      expect(replace).not.toHaveBeenCalled();
    });

    it("never redirects a Russian route back onto itself", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/ru");
      expect(replace).not.toHaveBeenCalled();
    });

    it("leaves inner Russian routes alone", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/ru/rooms");
      expect(replace).not.toHaveBeenCalled();
    });

    it("still routes when localStorage is unavailable", () => {
      setPrimaryLanguage("ru-RU");
      vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      runAt("/rooms");
      expect(replace).toHaveBeenCalledWith("/ru/rooms");
    });
  });

  describe("a stored preference always wins", () => {
    it("keeps a Russian browser on English when EN was chosen", () => {
      setPrimaryLanguage("ru-RU");
      localStorage.setItem(LANG_PREF_KEY, "en");
      runAt("/rooms");
      expect(replace).not.toHaveBeenCalled();
    });

    it("pulls a stored-EN visitor off a Russian route", () => {
      localStorage.setItem(LANG_PREF_KEY, "en");
      runAt("/ru/rooms");
      expect(replace).toHaveBeenCalledWith("/rooms");
    });

    it("returns a stored-EN visitor from the Russian home page to /", () => {
      localStorage.setItem(LANG_PREF_KEY, "en");
      runAt("/ru");
      expect(replace).toHaveBeenCalledWith("/");
    });

    it("sends a stored-RU visitor to the Russian route", () => {
      localStorage.setItem(LANG_PREF_KEY, "ru");
      runAt("/rooms");
      expect(replace).toHaveBeenCalledWith("/ru/rooms");
    });
  });

  describe("?lang= escape hatch", () => {
    it("keeps a Russian browser on the English page and remembers it", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms?lang=en");
      expect(replace).not.toHaveBeenCalled();
      expect(localStorage.getItem(LANG_PREF_KEY)).toBe("en");
    });

    it("overrides a stored RU preference", () => {
      setPrimaryLanguage("ru-RU");
      localStorage.setItem(LANG_PREF_KEY, "ru");
      runAt("/rooms?lang=en");
      expect(replace).not.toHaveBeenCalled();
    });

    it("forces an English browser onto the Russian route", () => {
      runAt("/rooms?lang=ru");
      expect(replace).toHaveBeenCalledWith("/ru/rooms?lang=ru");
    });

    it("settles rather than looping once the forced locale is reached", () => {
      runAt("/ru/rooms?lang=ru");
      expect(replace).not.toHaveBeenCalled();
    });

    it("ignores a lang value it does not recognise", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms?lang=de");
      expect(replace).toHaveBeenCalledWith("/ru/rooms?lang=de");
    });

    it("is not fooled by a different parameter ending in 'lang'", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms?hreflang=en");
      expect(replace).toHaveBeenCalledWith("/ru/rooms?hreflang=en");
    });
  });

  describe("URL handling", () => {
    it("carries the query string and hash across", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms?utm_source=ig#gallery");
      expect(replace).toHaveBeenCalledWith("/ru/rooms?utm_source=ig#gallery");
    });

    it("normalises a trailing slash before matching", () => {
      setPrimaryLanguage("ru-RU");
      runAt("/rooms/");
      expect(replace).toHaveBeenCalledWith("/ru/rooms");
    });
  });
});
