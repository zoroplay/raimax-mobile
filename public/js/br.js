(function (e, t, r) {
  var i = e[r] = e[r] || {},
    s = 2,
    n = 1,
    a = 0,
    o = a,
    l = "/js/br2.js".split(":"),
    p = "".split(":"),
    u = {},
    c = "",
    d = false,
    f = "" === "1",
    h = parseInt("3", 10),
    g = "",
    v = false,
    m = true,
    y = true,
    _ = false,
    $ = "",
    w = "",
    b = t.currentScript,
    S, C = false,
    I = {
      wlLoaded: +new Date
    };
  if (b && (b.src || b.id == "sr-widgetloader")) {
    d = b;
    v = !!b.getAttribute("data-autoInit") || false
  } else {
    d = t.getElementById("sr-widgetloader");
    if (!d) {
      var R = t.getElementsByTagName("script");
      var A = R.length;
      var k;
      for (var q = 0; q < A; q++) {
        if (R[q].src.match(/\?.*widgetloader/i)) {
          d = R[q];
          break
        } else if (!k && R[q].src.match(/widgetloader/i)) {
          k = R[q]
        }
      }
      d = d || k
    }
  }
  if (!d) {
    throw new Error("Could not find current script tag")
  }
  var E = function (e, t) {
    var r = d.getAttribute("data-" + e);
    return r === undefined || r === null ? t : r
  };
  c = d.src;
  v = E("autoInit", "false") == "true";
  y = E("loadScripts", "true") == "true";
  m = E("loadCss", "true") == "true";
  S = E("queryRoot", "/");
  _ = E("matchId", false);
  $ = E("timezone", false);
  w = E("appPath", false);
  if (!c) {
    var H = e.location;
    var O = H.protocol;
    var U = H.port;
    if (O.substr(0, 4) !== "http") {
      O = "http:"
    }
    g = O + "//" + H.hostname + (U ? ":" + U : "") + w
  } else {
    g = c.split(S)[0]
  }
  if (f) {
    g = "https://" + g.split("//")[1]
  }
  var x = function (e) {
    if (o != s) {
      var t = i._latestWidgetHandle++;
      u[t] = arguments;
      L();
      return t
    } else {
      if (!C) {
        var r = e && e.name || e;
        if (r === "widgets.lmts") {
          Q()
        }
      }
      return i.w.add.apply(i.w, arguments)
    }
  };
  var B = function (e) {
    if (o != s) {
      if (u[e]) {
        delete u[e];
        return true
      }
      return false
    } else {
      return i.w.remove(e)
    }
  };
  var L = function () {
    if (o !== a) {
      return false
    }
    o = n;
    if (m) {
      for (var e = 0; e < p.length; e++) {
        if (p[e]) {
          z(p[e])
        }
      }
    }
    if (y && l.length > 0) {
      I.srliveLoadStart = +new Date;
      if (l[W]) {
        P(l[W])
      }
    } else {
      M()
    }
  };

  function z(e) {
    var r = t.createElement("link");
    r.setAttribute("rel", "stylesheet");
    r.setAttribute("type", "text/css");
    r.setAttribute("href", g + e);
    r.className = "srlive-stylesheet";
    t.getElementsByTagName("head")[0].appendChild(r)
  }
  var N = 0;
  var W = 0;

  function T(e) {
    e.onload = e.onreadystatechange = null;
    W++;
    N++;
    if (N === l.length) {
      M();
      return
    }
    if (W < l.length) {
      P(l[W])
    }
  }

  function P(e) {
    var r = t.createElement("script");
    r.type = "text/javascript";
    r.src = g + e;
    r.className = "srlive-script";
    var i = t.getElementsByTagName("HEAD");
    if (i[0]) {
      i[0].appendChild(r)
    }
    r.onload = r.onreadystatechange = function () {
      if (this.readyState && this.readyState !== "loaded" && this.readyState !== "complete") {
        return
      }
      T(r)
    }
  }
  var j = {};
  var D = function (e, t) {
    var r = t.split("."),
      s = r.pop(),
      n = 0,
      a = e.length;
    var o = SRUtil.getPropertyArray(i, r),
      l;
    if (o[s]) {
      for (; n < a; n++) {
        l = o[s].apply(o, e[n])
      }
    }
    return l
  };
  var F = function (e, t) {
    if (!y) {
      var r = e.split("."),
        n = r.pop(),
        a = SRUtil.getPropertyArray(i, r),
        l = a[n];
      return function () {
        return l.apply(a, arguments)
      }
    } else {
      return function () {
        if (o === s) {
          return D([arguments], e)
        } else if (t) {
          j[e] = [arguments]
        } else {
          (j[e] = j[e] || []).push(arguments)
        }
        return false
      }
    }
  };
  var Q = function () {
    i.setup.query.url = "https://lmt.fn.sportradar.com";
    i.setup.query.queryRoot = "/";
    K(i.setup)
  };
  var V = function () {
    i.setup.query.url = "https://lsc.fn.sportradar.com";
    i.setup.query.queryRoot = "/";
    K(i.setup)
  };
  var J = /(\.(sportradar|betradar)\.com)/;
  var G = function (e, t) {
    if (e[t]) {
      e[t] = e[t].replace(J, ".swiftscore.com")
    }
  };
  var K = function (e) {
    if (/swiftscore\.com/.test(g)) {
      G(e.query, "url");
      G(e.widget, "crestHost");
      G(e.widget, "statHost")
    }
  };
  var M = function () {
    var t = JSON.parse('0') || {};
    var r = SRUtil.extend(true, {
      debugLevel: h,
      client: {
        timezone: $ || "Europe/Berlin",
        language: "en",
        name: "betking",
        s4clientid: "160",
        bookmakerId: "24124",
        oddsBookmakerId: "24124",
        build: "clientsetup-widgets/master/#1076/2c7cb77/2019-03-11-11:04:45-1552298685-11/03/19 10:04:45 GMT"
      },
      query: {
        url: "https://widgets.fn.sportradar.com",
        queryRoot: "/",
        timezoneAgnostic: true,
        service_id: parseInt('24', 10),
        fullfeed_config_id: parseInt('0', 10)
      },
      widget: {
        solution: "widgets",
        url: g,
        setupOverridesOptions: false,
        css: true,
        matchId: _,
        version: '3865445290',
        cssVersion: '1356605941',
        cssClient: "betking",
        preferHttps: f,
        queryRoot: S
      },
      eventpoller: {
        feeds: {
          event_fullfeed: {
            disabled: true
          },
          event_get: {
            disabled: true
          }
        }
      }
    }, t, e.SRConfig || {});
    K(r);
    o = s;
    var n = (r.client.layout || "").toLowerCase();
    C = n.indexOf("sportcenter") > -1 || n.indexOf("oddscomparison") > -1 || n.indexOf("euro") > -1;
    i.configureClient(r);
    if (u) {
      if (C) {
        V()
      } else if (Object.keys(u).indexOf("widgets.lmts") > -1) {
        Q()
      }
      SRUtil.each(u, function (e, t) {
        i.w.addFromWidgetloader(t, e)
      })
    }
    SRUtil.each(j, function () {
      D.apply(this, arguments)
    });
    j = null
  };
  i["_timing"] = I;
  i["_latestWidgetHandle"] = 0;
  i["init"] = L;
  i["addWidget"] = x;
  i["removeWidget"] = B;
  i["getWidget"] = F("w.get");
  i["changeLanguage"] = F("languages.change", true);
  i["changeTimezone"] = F("changeTimezone", true);
  i["triggerEvent"] = F("event.trigger");
  i["on"] = F("event.subscribe");
  i["off"] = F("event.unsubscribe");
  if (v || e.SRConfig && e.SRConfig.autoInit === true) {
    i.init()
  }
})(window, document, "SRLive");
