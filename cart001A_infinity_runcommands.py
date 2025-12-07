cart001A_infinity_runcommands.js
(function(){
  const id = 'cart001A_infinity_runcommands';
  const panel = document.createElement('div');
  panel.className = 'panel';
  panel.innerHTML = `
    <h2>Cart 001A · Infinity Run Commands</h2>
    <p class="muted">Command palette for executing Infinity functions and triggering modules.</p>
    <div class="row">
      <input id="${id}_cmd" placeholder="Type command">
      <button class="btn" id="${id}_run">Run</button>
    </div>
    <div class="log" id="${id}_log"></div>
  `;
  document.body.appendChild(panel);
  const log = document.getElementById(`${id}_log`);
  const l = m => { log.textContent += m + "\\n"; log.scrollTop = log.scrollHeight; };
  document.getElementById(`${id}_run`).onclick = () => {
    const cmd = document.getElementById(`${id}_cmd`).value.trim();
    if (!cmd) return l("Enter a command.");
    l(`> ${cmd}`);
    // TODO: parse and route command
  };
  console.log(`${id} loaded`);
})();