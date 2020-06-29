/**
 * Another way to use fetch is by using the async and await keywords. This
 * allows you to use the return values directly instead of going through
 * Promises.
 */
async function getServerMessage() {
  const message = await (await fetch('/data')).text();
  console.log(message);
  
  document.getElementById('footer-text').innerText += (" " + message);
}
