var data = [];
var loaded = false;

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
          renderResults(data);
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
    out = '<p>No results</p>';
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

function doSearch() {
  var q = document.getElementById('q');
  var query = '';
  if (q) { query = q.value.replace(/^\s+|\s+$/g, '').toLowerCase(); }
  if (!loaded) { loadData(); }
  if (!query) { renderResults(data); return false; }
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
  if (!query) { renderResults(data); return false; }
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
};
