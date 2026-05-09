window.dataLayer = window.dataLayer || [];
window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
window.gtag('js', new Date());
window.gtag('config', 'G-1NVEKB6YL1');

(function () {
  var panels = document.querySelectorAll('.skills-panel');
  if (!panels.length) return;
  var mq = window.matchMedia('(min-width: 900px)');
  function sync(e) {
    panels.forEach(function (panel) {
      if (e.matches) {
        if (!panel.open) {
          panel.setAttribute('data-forced', 'true');
          panel.open = true;
        }
      } else if (panel.getAttribute('data-forced') === 'true') {
        panel.open = false;
        panel.removeAttribute('data-forced');
      }
    });
  }
  sync(mq);
  if (mq.addEventListener) {
    mq.addEventListener('change', sync);
  } else if (mq.addListener) {
    mq.addListener(sync);
  }
})();

(function () {
  function closeAllMenus() {
    document.querySelectorAll('.site-header.is-open').forEach(function (header) {
      var toggle = header.querySelector('.menu-toggle');
      var menu = header.querySelector('.mobile-menu');
      header.classList.remove('is-open');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
      if (menu) menu.setAttribute('aria-hidden', 'true');
    });
  }

  document.addEventListener('click', function (event) {
    var toggle = event.target.closest('.menu-toggle');
    var header = event.target.closest('.site-header');
    if (toggle && header) {
      var isOpen = header.classList.contains('is-open');
      closeAllMenus();
      if (!isOpen) {
        header.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        var menu = header.querySelector('.mobile-menu');
        if (menu) menu.setAttribute('aria-hidden', 'false');
      }
      return;
    }

    if (!header) {
      closeAllMenus();
      return;
    }

    if (!event.target.closest('.mobile-menu')) {
      closeAllMenus();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllMenus();
    }
  });

  document.querySelectorAll('.mobile-menu a').forEach(function (link) {
    link.addEventListener('click', function () {
      closeAllMenus();
    });
  });

  document.querySelectorAll('input[name="lang"]').forEach(function (input) {
    input.addEventListener('change', function () {
      closeAllMenus();
    });
  });
})();

(function () {
  var triggers = document.querySelectorAll('[data-card-target]');
  var cards = document.querySelectorAll('.profile-card');
  if (!triggers.length || !cards.length) return;
  var activeCard = null;
  var activeTrigger = null;
  var lastFocused = null;

  function openCard(card, trigger) {
    if (!card) return;
    if (activeCard && activeCard !== card) {
      closeCard(activeCard, activeTrigger);
    }
    activeCard = card;
    activeTrigger = trigger || null;
    lastFocused = document.activeElement;
    card.classList.add('is-visible');
    card.setAttribute('aria-hidden', 'false');
    if (activeTrigger) {
      activeTrigger.setAttribute('aria-expanded', 'true');
    }
    document.body.classList.add('card-open');
    var focusTarget = card.querySelector('.profile-card__panel');
    if (focusTarget) {
      focusTarget.focus();
    }
  }

  function closeCard(card, trigger) {
    if (!card) return;
    card.classList.remove('is-visible');
    card.setAttribute('aria-hidden', 'true');
    if (trigger) {
      trigger.setAttribute('aria-expanded', 'false');
    }
    document.body.classList.remove('card-open');
    activeCard = null;
    activeTrigger = null;
    if (lastFocused && lastFocused.focus) {
      lastFocused.focus();
    }
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var targetId = trigger.getAttribute('data-card-target');
      var card = document.getElementById(targetId);
      openCard(card, trigger);
    });
  });

  cards.forEach(function (card) {
    card.addEventListener('click', function (event) {
      if (event.target.closest('[data-card-close]')) {
        closeCard(card, activeTrigger);
      }
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && activeCard) {
      closeCard(activeCard, activeTrigger);
    }
  });

  document.querySelectorAll('input[name="lang"]').forEach(function (input) {
    input.addEventListener('change', function () {
      if (activeCard) {
        closeCard(activeCard, activeTrigger);
      }
    });
  });

  function setLanguageFromCard(cardId) {
    var isEn = /-en$/.test(cardId);
    var toggle = document.getElementById(isEn ? 'lang-en' : 'lang-ja');
    if (!toggle || toggle.checked) return;
    toggle.checked = true;
    var changeEvent;
    if (typeof Event === 'function') {
      changeEvent = new Event('change', { bubbles: true });
    } else {
      changeEvent = document.createEvent('Event');
      changeEvent.initEvent('change', true, true);
    }
    toggle.dispatchEvent(changeEvent);
  }

  function openFromHash() {
    var rawHash = window.location.hash || '';
    if (!rawHash) {
      if (activeCard) {
        closeCard(activeCard, activeTrigger);
      }
      return;
    }
    var targetId = decodeURIComponent(rawHash).replace(/^#/, '');
    var card = document.getElementById(targetId);
    if (card && card.classList.contains('profile-card')) {
      setLanguageFromCard(targetId);
      openCard(card, null);
      return;
    }
    if (activeCard && activeCard.id !== targetId) {
      closeCard(activeCard, activeTrigger);
    }
  }

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
})();

(function () {
  var canvas = document.querySelector('.flow-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;
  var maskCanvas = document.createElement('canvas');
  var maskCtx = maskCanvas.getContext('2d');
  if (!maskCtx) return;
  var occlusionCanvas = document.createElement('canvas');
  var occlusionCtx = occlusionCanvas.getContext('2d');
  if (!occlusionCtx) return;
  var textMaskCanvas = document.createElement('canvas');
  var textMaskCtx = textMaskCanvas.getContext('2d');
  if (!textMaskCtx) return;

  var doc = document.documentElement;
  var dpr = window.devicePixelRatio || 1;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var points = [];
  var docHeight = 0;
  var scheduled = false;
  var cachedSize = { width: 0, height: 0 };
  var maxDrawLimit = 0;

  var FLOW = {
    lead: 0.6,
    radius: 200
  };

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function getStyleValue(name, fallback) {
    var value = getComputedStyle(document.documentElement).getPropertyValue(name);
    if (!value) return fallback;
    return value.trim() || fallback;
  }

  function toOpaqueColor(color, fallback) {
    if (!color) return fallback;
    var rgbaMatch = color.match(/^rgba\(([^)]+)\)$/i);
    if (rgbaMatch) {
      var parts = rgbaMatch[1].split(',').map(function (item) {
        return item.trim();
      });
      if (parts.length >= 3) {
        return 'rgb(' + parts[0] + ', ' + parts[1] + ', ' + parts[2] + ')';
      }
    }
    return color;
  }

  function getActivePanel() {
    var enToggle = document.getElementById('lang-en');
    if (enToggle && enToggle.checked) {
      return document.querySelector('.lang-panel--en');
    }
    return document.querySelector('.lang-panel--ja');
  }

  function buildRoute(width, height) {
    var panel = getActivePanel() || document.body;
    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var lake = panel.querySelector('.lake-hero__lake');
    var lead = panel.querySelector('.lead-block');
    var services = panel.querySelector('.services');
    var serviceCards = services ? services.querySelectorAll('.service-card') : [];
    if (!lake || !lead) return [];
    var lakeRect = lake.getBoundingClientRect();
    var leadRect = lead.getBoundingClientRect();
    var servicesRect = services ? services.getBoundingClientRect() : null;
    var servicesHeader = services ? services.querySelector('.section__header') : null;
    var headerRect = servicesHeader ? servicesHeader.getBoundingClientRect() : null;
    var cardRects = [];
    if (!lakeRect.width || !leadRect.height) return [];
    if (serviceCards && serviceCards.length) {
      for (var i = 0; i < serviceCards.length; i++) {
        var rect = serviceCards[i].getBoundingClientRect();
        if (rect.width && rect.height) {
          cardRects.push(rect);
        }
      }
    }

    var startX = lakeRect.left + lakeRect.width * 0.5;
    var startY = lakeRect.top + scrollTop + lakeRect.height * 0.92;
    startX = clamp(startX, width * 0.15, width * 0.85);
    startY = clamp(startY, 0, height);

    var topY = leadRect.top + scrollTop - Math.max(20, window.innerHeight * 0.06);
    var servicesTop = servicesRect
      ? servicesRect.top + scrollTop
      : leadRect.top + scrollTop + leadRect.height;
    var headerTop = headerRect ? headerRect.top + scrollTop : servicesTop;
    var midGapY = servicesTop + (headerTop - servicesTop) * 0.5;
    var defaultGapY = servicesTop - Math.max(36, window.innerHeight * 0.05);
    var bottomY = headerRect && headerTop > servicesTop ? midGapY : defaultGapY;
    topY = clamp(topY, startY + 80, height);
    bottomY = clamp(bottomY, topY + 160, height);

    var spill = Math.max(140, width * 0.35);
    var rightX = width + spill;
    var leftX = -spill;
    var dropY = startY + (topY - startY) * 0.35;
    var midY = startY + (topY - startY) * 0.7;
    var bendX = startX + (rightX - startX) * 0.45;
    var progressBottomY = bottomY + Math.max(24, window.innerHeight * 0.04);
    var horizontalSteps = 5;
    var horizontalProgress = Math.max(280, window.innerHeight * 0.45);
    var horizontalPoints = [];

    for (var i = 0; i <= horizontalSteps; i++) {
      var t = i / horizontalSteps;
      horizontalPoints.push({
        x: rightX + (leftX - rightX) * t,
        y: bottomY,
        progressY: progressBottomY + horizontalProgress * t
      });
    }

    var route = [
      { x: startX, y: startY },
      { x: startX, y: dropY },
      { x: bendX, y: midY },
      { x: rightX, y: topY }
    ].concat(horizontalPoints);

    if (cardRects.length) {
      var card1 = cardRects[0];
      var card2 = cardRects[1] || cardRects[0];
      var card3 = cardRects[2] || cardRects[cardRects.length - 1];
      var headerBottom = headerRect
        ? headerRect.top + scrollTop + headerRect.height
        : servicesTop;
      var lanePad = Math.max(14, window.innerHeight * 0.02);
      var lane1Y = card1.top + scrollTop - Math.max(22, card1.height * 0.12);
      var lane2Y = card2.top + scrollTop - Math.max(20, card2.height * 0.1);
      var lane3Y = card3.top + scrollTop - Math.max(18, card3.height * 0.08);
      lane1Y = clamp(Math.max(lane1Y, headerBottom + lanePad), 0, height);
      lane2Y = clamp(Math.max(lane2Y, headerBottom + lanePad), 0, height);
      lane3Y = clamp(Math.max(lane3Y, headerBottom + lanePad), 0, height);

      var anchor1 = {
        x: card1.left + card1.width * 0.2,
        y: lane1Y
      };
      var anchor2 = {
        x: card2.left + card2.width * 0.5,
        y: lane2Y
      };
      var anchor3 = {
        x: card3.left + card3.width * 0.8,
        y: lane3Y
      };
      var entryY = lane1Y;
      var flowExitY = clamp(
        lane3Y + Math.max(20, card3.height * 0.08),
        0,
        height
      );
      var flowStart = entryY;
      var flowSpan = Math.max(480, window.innerHeight * 0.85);

      route.push({ break: true });
      route = route.concat([
        { x: leftX, y: entryY, progressY: flowStart },
        { x: anchor1.x, y: anchor1.y, progressY: flowStart + flowSpan * 0.25 },
        { x: anchor2.x, y: anchor2.y, progressY: flowStart + flowSpan * 0.55 },
        { x: anchor3.x, y: anchor3.y, progressY: flowStart + flowSpan * 0.8 },
        { x: rightX, y: flowExitY, progressY: flowStart + flowSpan }
      ]);
    }

    return route;
  }

  function setCanvasSize() {
    var width = window.innerWidth || doc.clientWidth;
    var height = window.innerHeight || doc.clientHeight;
    if (width === cachedSize.width && height === cachedSize.height) return;
    cachedSize.width = width;
    cachedSize.height = height;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    maskCanvas.width = Math.round(width * dpr);
    maskCanvas.height = Math.round(height * dpr);
    maskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    occlusionCanvas.width = Math.round(width * dpr);
    occlusionCanvas.height = Math.round(height * dpr);
    occlusionCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    textMaskCanvas.width = Math.round(width * dpr);
    textMaskCanvas.height = Math.round(height * dpr);
    textMaskCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function buildVisiblePoints(drawLimit, scrollTop) {
    var visible = [];
    var last = null;
    var lastProgress = null;
    for (var i = 0; i < points.length; i++) {
      var point = points[i];
      if (point.break) {
        if (visible.length) {
          visible.push({ break: true });
        }
        last = null;
        lastProgress = null;
        continue;
      }
      var progress = typeof point.progressY === 'number' ? point.progressY : point.y;
      if (progress > drawLimit) {
        if (last) {
          var ratio = (drawLimit - lastProgress) / ((progress - lastProgress) || 1);
          visible.push({
            x: last.x + (point.x - last.x) * ratio,
            y: last.y + (point.y - last.y) * ratio - scrollTop,
            progress: drawLimit
          });
        }
        break;
      }
      visible.push({ x: point.x, y: point.y - scrollTop, progress: progress });
      last = point;
      lastProgress = progress;
    }
    return visible;
  }

  function drawRoundedPath(list, radius, context) {
    if (!list.length) return;
    var c = context || ctx;

    function strokeSegment(segment) {
      if (segment.length < 2) return;
      c.beginPath();
      c.moveTo(segment[0].x, segment[0].y);
      for (var i = 1; i < segment.length - 1; i++) {
        var prev = segment[i - 1];
        var current = segment[i];
        var next = segment[i + 1];
        var v1x = current.x - prev.x;
        var v1y = current.y - prev.y;
        var v2x = next.x - current.x;
        var v2y = next.y - current.y;
        var len1 = Math.hypot(v1x, v1y) || 1;
        var len2 = Math.hypot(v2x, v2y) || 1;
        var r = Math.min(radius, len1 * 0.45, len2 * 0.45);
        var startX = current.x - (v1x / len1) * r;
        var startY = current.y - (v1y / len1) * r;
        var endX = current.x + (v2x / len2) * r;
        var endY = current.y + (v2y / len2) * r;
        c.lineTo(startX, startY);
        c.quadraticCurveTo(current.x, current.y, endX, endY);
      }
      c.lineTo(segment[segment.length - 1].x, segment[segment.length - 1].y);
      c.stroke();
    }

    var segment = [];
    for (var i = 0; i < list.length; i++) {
      var point = list[i];
      if (point.break) {
        strokeSegment(segment);
        segment = [];
        continue;
      }
      segment.push(point);
    }
    strokeSegment(segment);
  }

  function drawNodes(list, spacing, radius, context, drawLimit) {
    if (!list.length || spacing <= 0 || radius <= 0) return;
    var c = context || ctx;
    var nodeColor = toOpaqueColor(getStyleValue('--lake-line-node', 'rgba(0, 190, 255, 0.45)'), '#00aaff');
    var lineColor = toOpaqueColor(getStyleValue('--lake-line-stroke', nodeColor), nodeColor);
    var branchColor = toOpaqueColor(getStyleValue('--lake-line-node-branch', lineColor), lineColor);
    var branchWidth = parseFloat(getStyleValue('--lake-line-node-branch-width', '3')) || 3;
    var branchLength = parseFloat(getStyleValue('--lake-line-node-branch-length', '32')) || 32;
    var branchDelay = parseFloat(getStyleValue('--lake-line-node-branch-delay', '280')) || 280;
    var branchGrow = parseFloat(getStyleValue('--lake-line-node-branch-grow', '360')) || 360;

    function pseudo(seed) {
      var value = Math.sin(seed * 12.9898) * 43758.5453;
      return value - Math.floor(value);
    }

    c.save();
    c.globalAlpha = 1;
    c.lineCap = 'round';
    c.lineJoin = 'round';

    var carry = 0;
    var prev = null;
    var nodeIndex = 0;
    var segmentIndex = 0;

    for (var i = 0; i < list.length; i++) {
      var point = list[i];
      if (point.break) {
        prev = null;
        carry = 0;
        segmentIndex++;
        continue;
      }
      if (!prev) {
        prev = point;
        continue;
      }
      var dx = point.x - prev.x;
      var dy = point.y - prev.y;
      var segLen = Math.hypot(dx, dy);
      if (!segLen) {
        prev = point;
        continue;
      }
      var ux = dx / segLen;
      var uy = dy / segLen;
      var dist = segLen;
      var startX = prev.x;
      var startY = prev.y;
      var baseAngle = Math.atan2(uy, ux);
      var progressStart = typeof prev.progress === 'number' ? prev.progress : prev.y;
      var progressEnd = typeof point.progress === 'number' ? point.progress : point.y;
      var progressDelta = progressEnd - progressStart;
      var traveled = 0;

      while (carry + dist >= spacing) {
        var step = spacing - carry;
        var nx = startX + ux * step;
        var ny = startY + uy * step;
        traveled += step;
        var progressRatio = segLen ? traveled / segLen : 0;
        var nodeProgress = progressStart + progressDelta * progressRatio;
        var branchFactor = drawLimit - nodeProgress - branchDelay;
        branchFactor = clamp(branchFactor / branchGrow, 0, 1);

        var seed = nodeIndex + segmentIndex * 137;
        var branchChance = pseudo(seed + 3);
        var forceBranch = branchChance <= 0.15 && branchFactor >= 0.6;
        if ((branchChance > 0.15 || forceBranch) && branchFactor > 0) {
          var branchCount = forceBranch ? 1 : (branchChance > 0.86 ? 3 : (branchChance > 0.55 ? 2 : 1));
          for (var b = 0; b < branchCount; b++) {
            var side = pseudo(seed + 11 + b) > 0.5 ? 1 : -1;
            var angleSpread = 0.55 + pseudo(seed + 19 + b) * 0.6;
            var branchAngle = baseAngle + side * angleSpread;
            var lengthScale = 0.85 + pseudo(seed + 27 + b) * 0.45;
            var branchLen = branchLength * lengthScale * branchFactor;
            var bx = nx + Math.cos(branchAngle) * branchLen;
            var by = ny + Math.sin(branchAngle) * branchLen;
            var curveOffset = (pseudo(seed + 33 + b) - 0.5) * branchLen * 0.35;
            var cx = nx + Math.cos(branchAngle) * branchLen * 0.5 - Math.sin(branchAngle) * curveOffset;
            var cy = ny + Math.sin(branchAngle) * branchLen * 0.5 + Math.cos(branchAngle) * curveOffset;

            c.strokeStyle = branchColor;
            c.lineWidth = branchWidth;
            c.beginPath();
            c.moveTo(nx, ny);
            c.quadraticCurveTo(cx, cy, bx, by);
            c.stroke();

            c.fillStyle = lineColor;
            c.beginPath();
            c.arc(bx, by, Math.max(1.2, radius * 0.55 * branchFactor), 0, Math.PI * 2);
            c.fill();
          }
        }

        c.fillStyle = lineColor;
        c.beginPath();
        c.arc(nx, ny, radius, 0, Math.PI * 2);
        c.fill();

        startX = nx;
        startY = ny;
        dist -= step;
        carry = 0;
        nodeIndex++;
      }

      carry += dist;
      prev = point;
    }

    c.restore();
  }

  function applyOcclusions(width, height) {
    var panel = getActivePanel() || document.body;
    var header = document.querySelector('.site-header');
    var lake = panel ? panel.querySelector('.lake-hero__lake') : null;
    var services = panel ? panel.querySelector('.services') : null;
    var servicesHeader = panel ? panel.querySelector('.services .section__header') : null;
    var serviceMaskAlpha = parseFloat(getStyleValue('--lake-line-service-mask', '0.45'));
    serviceMaskAlpha = clamp(isNaN(serviceMaskAlpha) ? 0.45 : serviceMaskAlpha, 0, 1);
    if (!occlusionCtx || !textMaskCtx) return;

    var basePad = Math.max(10, ctx.lineWidth * 0.7, ctx.shadowBlur || 0);
    occlusionCtx.clearRect(0, 0, width, height);
    textMaskCtx.clearRect(0, 0, width, height);
    occlusionCtx.fillStyle = '#000';
    textMaskCtx.fillStyle = '#000';

    function drawMask(targetCtx, item, pad) {
      if (!item || !item.rect) return;
      var rect = item.rect;
      if (!rect || rect.width <= 0 || rect.height <= 0) return;
      if (rect.bottom < -pad || rect.top > height + pad || rect.right < -pad || rect.left > width + pad) {
        return;
      }
      if (item.type === 'ellipse') {
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        targetCtx.beginPath();
        targetCtx.ellipse(cx, cy, rect.width / 2 + pad, rect.height / 2 + pad, 0, 0, Math.PI * 2);
        targetCtx.fill();
        return;
      }
      targetCtx.fillRect(rect.left - pad, rect.top - pad, rect.width + pad * 2, rect.height + pad * 2);
    }

    if (header) {
      drawMask(occlusionCtx, { type: 'rect', rect: header.getBoundingClientRect() }, basePad);
    }
    if (lake) {
      drawMask(occlusionCtx, { type: 'ellipse', rect: lake.getBoundingClientRect() }, basePad);
    }

    if (servicesHeader) {
      drawMask(occlusionCtx, {
        type: 'rect',
        rect: servicesHeader.getBoundingClientRect()
      }, Math.max(12, basePad));
    }

    if (services) {
      drawMask(textMaskCtx, { type: 'rect', rect: services.getBoundingClientRect() }, 0);
    }

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.drawImage(occlusionCanvas, 0, 0, width, height);
    if (serviceMaskAlpha > 0) {
      ctx.globalAlpha = serviceMaskAlpha;
      ctx.drawImage(textMaskCanvas, 0, 0, width, height);
    }
    ctx.restore();
  }

  function draw(progressOverride) {
    setCanvasSize();
    var width = cachedSize.width;
    var height = cachedSize.height;
    if (!width || !height) return;

    var scrollTop = window.pageYOffset || doc.scrollTop || 0;
    var drawLimit = typeof progressOverride === 'number'
      ? docHeight * progressOverride
      : Math.min(docHeight, scrollTop + height * FLOW.lead);
    var firstPoint = points[0];
    if (firstPoint && firstPoint.y > drawLimit && firstPoint.y < scrollTop + height) {
      drawLimit = firstPoint.y;
    }

    var startOffset = Math.max(140, height * 0.28);
    var scrollFactor = clamp(scrollTop / (height * 0.6), 0, 1);
    drawLimit = Math.min(docHeight, drawLimit + startOffset * scrollFactor);
    if (typeof progressOverride === 'number') {
      maxDrawLimit = drawLimit;
    } else {
      maxDrawLimit = Math.max(maxDrawLimit, drawLimit);
      drawLimit = maxDrawLimit;
    }

    var lineStroke = getStyleValue('--lake-line-stroke', 'rgba(56, 189, 248, 0.32)');
    var lineColor = toOpaqueColor(lineStroke, '#38bdf8');
    var lineWidth = parseFloat(getStyleValue('--lake-line-width', '8')) || 8;
    var lineShadow = getStyleValue('--lake-line-shadow', 'rgba(14, 165, 233, 0.18)');
    var lineShadowBlur = parseFloat(getStyleValue('--lake-line-shadow-blur', '6')) || 6;
    var lineOpacity = parseFloat(getStyleValue('--lake-line-opacity', '0.8')) || 0.8;

    var visible = buildVisiblePoints(drawLimit, scrollTop);
    if (!visible.length) return;

    maskCtx.clearRect(0, 0, width, height);
    maskCtx.globalCompositeOperation = 'source-over';
    maskCtx.strokeStyle = lineColor;
    maskCtx.lineWidth = lineWidth;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.shadowColor = 'transparent';
    maskCtx.shadowBlur = 0;
    drawRoundedPath(visible, Math.max(FLOW.radius, width * 0.16), maskCtx);
    var nodeSpacing = parseFloat(getStyleValue('--lake-line-node-spacing', '220')) || 220;
    var nodeRadius = parseFloat(getStyleValue('--lake-line-node-size', '8')) || 8;
    nodeSpacing = Math.max(nodeSpacing, nodeRadius * 8);
    drawNodes(visible, nodeSpacing, nodeRadius, maskCtx, drawLimit);

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.globalAlpha = lineOpacity;
    ctx.shadowColor = lineShadow;
    ctx.shadowBlur = lineShadowBlur;
    ctx.drawImage(maskCanvas, 0, 0, width, height);
    ctx.restore();
    ctx.lineWidth = lineWidth;
    ctx.shadowBlur = lineShadowBlur;
    applyOcclusions(width, height);
  }

  function refresh() {
    docHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    var width = Math.max(doc.clientWidth, window.innerWidth || 0);
    points = buildRoute(width, docHeight);
    maxDrawLimit = 0;
    draw();
  }

  function scheduleDraw() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(function () {
      scheduled = false;
      draw();
    });
  }

  setCanvasSize();
  refresh();

  if (motionQuery.matches) {
    draw(1);
    return;
  }

  window.addEventListener('scroll', scheduleDraw, { passive: true });
  window.addEventListener('resize', function () {
    setTimeout(function () {
      setCanvasSize();
      refresh();
    }, 120);
  });

  document.querySelectorAll('input[name="lang"]').forEach(function (input) {
    input.addEventListener('change', function () {
      setTimeout(function () {
        refresh();
      }, 120);
    });
  });

  if (motionQuery.addEventListener) {
    motionQuery.addEventListener('change', refresh);
  } else if (motionQuery.addListener) {
    motionQuery.addListener(refresh);
  }
})();

(function () {
  var sections = document.querySelectorAll('.before-after');
  if (!sections.length) return;
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  function reveal(section) {
    if (!section) return;
    section.classList.add('is-visible');
  }

  if (motionQuery.matches || !('IntersectionObserver' in window)) {
    sections.forEach(reveal);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(function (section) {
    observer.observe(section);
  });

  document.querySelectorAll('input[name="lang"]').forEach(function (input) {
    input.addEventListener('change', function () {
      setTimeout(function () {
        document.querySelectorAll('.before-after').forEach(function (section) {
          if (section.classList.contains('is-visible')) return;
          observer.observe(section);
          var rect = section.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
            reveal(section);
            observer.unobserve(section);
          }
        });
      }, 120);
    });
  });
})();
