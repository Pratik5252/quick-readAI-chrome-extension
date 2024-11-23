const options = {
  sharedContext: "English",
  type: "key-points",
  format: "markdown",
  length: "medium",
};

export const summarize = async () => {
  const available = (await self.ai.summarizer.capabilities()).available;
  let summarizer;
  if (available === "no") {
    // The Summarizer API isn't usable.
    return;
  }
  if (available === "readily") {
    // The Summarizer API can be used immediately .
    summarizer = await self.ai.summarizer.create(options);
    const stream = await summarizer.summarize(
      "The create() function lets you configure a new summarizer object to your needs. It takes an optional options object with the following parameters:sharedContext: Additional shared context that can help the summarizer.type: The type of the summarization, with the allowed values key-points (default), tl;dr, teaser, and headline.format: The format of the summarization, with the allowed values markdown (default), and plain-text.length: The length of the summarization, with the allowed values short, medium (default), and long. The meanings of these lengths vary depending on the type requested. For example, in Chrome's implementation, a short key-points summary consists of three bullet points, and a short summary is one sentence; a long key-points summary is seven bullet points, and a long summary is a paragraph."
    );
    let result = "";
    let previousChunk = "";
    for await (const chunk of stream) {
      const newChunk = chunk.startsWith(previousChunk)
        ? chunk.slice(previousChunk.length)
        : chunk;
      console.log(newChunk);
      result += newChunk;
      previousChunk = chunk;
    }
    console.log(result);
  } else {
    // The Summarizer API can be used after the model is downloaded.
    summarizer = await self.ai.summarizer.create(options);
    summarizer.addEventListener("downloadprogress", (e) => {
      console.log(e.loaded, e.total);
    });
    await summarizer.ready;
  }
};
