/**
 * Gets a message from the server and appends it to the footer's content.
 */
async function getServerMessage() {
  const message = await (await fetch('/data')).text();
  console.log(message);
  
  document.getElementById('footer-text').innerText += (" " + message);
}
