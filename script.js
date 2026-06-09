var data = [];
var loaded = false;
var currentSuggestions = [];
var suggestIndex = -1;

function setStatus(s) {
  var st = document.getElementById('status');
  if (st) { st.innerHTML = s; }
}

function loadData() {
  setStatus('Loading data...');
  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'ps3_mega_sites.json', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if ((xhr.status === 200) || (xhr.status === 0 && xhr.responseText)) {
        try {
          data = JSON.parse(xhr.responseText);
          loaded = true;
          setStatus('Ready. ' + data.length + ' items.');
        } catch (e) {
          setStatus('Error parsing JSON');
        }
      } else {
        setStatus('Failed to load ps3_mega_sites.json (HTTP ' + xhr.status + ')');
      }
    }
  };
  try {
    xhr.send(null);
  } catch (e) {
    setStatus('XHR send failed: ' + (e.message || e));
  }
}

function escapeHtml(s) {
  if (!s) return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderResults(items) {
  var out = '';
  if (!items || items.length === 0) {
    out = '';
  } else {
    out = '<table><tbody>';
    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      var title = escapeHtml(it.title || it.name || 'No title');
      var url = escapeHtml(it.url || it.link || '');
      var desc = escapeHtml(it.description || it.desc || '');
      out += '<tr><td class="result-title"><a href="' + url + '" target="_blank">' + title + '</a>';
      if (url) { out += '<div class="result-url">' + url + '</div>'; }
      out += '</td></tr>';
      out += '<tr><td class="result-desc">' + desc + '</td></tr>';
    }
    out += '</tbody></table>';
  }
  var r = document.getElementById('results');
  if (r) r.innerHTML = out;
}

  function showSuggestions(list) {
    var scont = document.getElementById('suggestions');
    if (!scont) return;
    if (!list || list.length === 0) {
      scont.style.display = 'none';
      scont.innerHTML = '';
      document.getElementById('q').setAttribute('aria-expanded', 'false');
      return;
    }
    var html = '';
    for (var i = 0; i < list.length; i++) {
      var it = list[i];
      var title = escapeHtml(it.title || it.name || '');
      var url = escapeHtml(it.url || it.link || '');
      html += '<div class="suggest-item" data-index="' + i + '" role="option">';
      html += '<div class="suggest-title">' + title + '</div>';
      if (url) html += '<div class="suggest-url">' + url + '</div>';
      html += '</div>';
    }
    scont.innerHTML = html;
    scont.style.display = 'block';
    document.getElementById('q').setAttribute('aria-expanded', 'true');
  }

  function hideSuggestions() {
    var scont = document.getElementById('suggestions');
    if (!scont) return;
    scont.style.display = 'none';
    scont.innerHTML = '';
    suggestIndex = -1;
    currentSuggestions = [];
    document.getElementById('q').setAttribute('aria-expanded', 'false');
  }

  function updateSuggestions(query) {
    if (!query) { hideSuggestions(); return; }
    if (!loaded) { loadData(); return; }
    var q = query.toLowerCase();
    var out = [];
    for (var i = 0; i < data.length; i++) {
      var it = data[i];
      var hay = ((it.title||it.name||'') + ' ' + (it.description||it.desc||'') + ' ' + (it.url||it.link||'')).toLowerCase();
      if (hay.indexOf(q) !== -1) {
        out.push(it);
        if (out.length >= 8) break;
      }
    }
    currentSuggestions = out;
    suggestIndex = -1;
    showSuggestions(out);
  }

  function chooseSuggestion(i) {
    if (!currentSuggestions || i < 0 || i >= currentSuggestions.length) return;
    var it = currentSuggestions[i];
    var q = document.getElementById('q');
    if (q) q.value = it.title || it.name || '';
    hideSuggestions();
    doSearch();
  }

function doSearch() {
  var q = document.getElementById('q');
  var query = '';
  if (q) { query = q.value.replace(/^\s+|\s+$/g, '').toLowerCase(); }
  if (!loaded) { loadData(); }
  if (!query) { renderResults([]); return false; }
  var out = [];
  for (var i = 0; i < data.length; i++) {
    var it = data[i];
    var hay = ((it.title||it.name||'') + ' ' + (it.description||it.desc||'') + ' ' + (it.url||it.link||'')).toLowerCase();
    if (hay.indexOf(query) !== -1) {
      out.push(it);
    }
  }
  renderResults(out);
  return false;
}

function luckySearch() {
  var q = document.getElementById('q');
  var query = '';
  if (q) { query = q.value.replace(/^\s+|\s+$/g, '').toLowerCase(); }
  if (!loaded) { loadData(); }
  if (!query) { return false; }
  for (var i = 0; i < data.length; i++) {
    var it = data[i];
    var hay = ((it.title||it.name||'') + ' ' + (it.description||it.desc||'') + ' ' + (it.url||it.link||'')).toLowerCase();
    if (hay.indexOf(query) !== -1) {
      var url = it.url || it.link || null;
      if (url) { window.location.href = url; }
      return false;
    }
  }
  renderResults([]);
  return false;
}

window.onload = function() {
  loadData();
  var qel = document.getElementById('q');
  var scont = document.getElementById('suggestions');
  if (qel) {
    qel.addEventListener('input', function(e) {
      var v = (e.target.value || '').replace(/^\s+|\s+$/g, '');
      updateSuggestions(v);
    });
    qel.addEventListener('keydown', function(e) {
      if (!scont || scont.style.display === 'none') return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        suggestIndex = Math.min(suggestIndex + 1, currentSuggestions.length - 1);
        updateSuggestionHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        suggestIndex = Math.max(suggestIndex - 1, 0);
        updateSuggestionHighlight();
      } else if (e.key === 'Enter') {
        if (suggestIndex >= 0) {
          e.preventDefault();
          chooseSuggestion(suggestIndex);
        }
      } else if (e.key === 'Escape') {
        hideSuggestions();
      }
    });
  }
  if (scont) {
    scont.addEventListener('click', function(e) {
      var item = e.target;
      while (item && !item.classList.contains('suggest-item')) {
        item = item.parentElement;
      }
      if (item && item.dataset && item.dataset.index) {
        chooseSuggestion(parseInt(item.dataset.index, 10));
      }
    });
  }
  document.addEventListener('click', function(e) {
    var box = document.getElementById('searchBox');
    if (!box) return;
    if (!box.contains(e.target)) { hideSuggestions(); }
  });
};

function updateSuggestionHighlight() {
  var scont = document.getElementById('suggestions');
  if (!scont) return;
  var items = scont.querySelectorAll('.suggest-item');
  for (var i = 0; i < items.length; i++) {
    items[i].classList.toggle('selected', i === suggestIndex);
  }
}
