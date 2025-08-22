import{C as e}from"./cache.05004cf3.js";import{k as t}from"./blockchain.62e14144.js";async function a(){if(await t(),!window.keplr)return;const n=await window.keplr.getOfflineSigner(e).getAccounts();return`Login iconLake
${new Date().toISOString()}
${n[0].address}`}export{a as g};
