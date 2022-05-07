const fetch = require("node-fetch");

module.exports = async (input, extention) => {
    if (!input) throw new Error("Input is a required argument");
    const url = "https://haste.aleks1123.xyz";
    const extension = extention || "txt";

    const res = await fetch(`${url}/documents/`, {
        method: "POST",
        body: input,
        headers: { "Content-Type": "text/plain" }
    });
    if (!res.ok) throw new Error(res.statusText);

    const { key } = await res.json();

    return `${url}/${key}.${extension}`;
};