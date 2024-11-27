const options = {
  sharedContext:
    "This is data of a web page, Overall summarize what this page is about.",
  type: "key-points",
  format: "markdown",
  length: "short",
};

export const summarize = async (content, onChunk) => {
  const available = (await self.ai.summarizer.capabilities()).available;
  let summarizer;
  if (available === "no") {
    // The Summarizer API isn't usable.
    return;
  }
  if (available === "readily") {
    // The Summarizer API can be used immediately .
    summarizer = await self.ai.summarizer.create(options);
    // const stream = await summarizer.summarizeStreaming(content);
    // let result = "";
    // let previousLength = 0;
    // for await (const segment of stream) {
    //   const newContent = segment.slice(previousLength);
    //   console.log(newContent);
    //   previousLength = segment.length;
    //   result += newContent;
    // }
    // return result;
    for await (const chunk of summarizer.summarizeStreaming(content)) {
      console.log(chunk);
      if (onChunk) {
        onChunk({ chunk });
      }
    }
  } else {
    // The Summarizer API can be used after the model is downloaded.
    summarizer = await self.ai.summarizer.create(options);
    summarizer.addEventListener("downloadprogress", (e) => {
      console.log(e.loaded, e.total);
    });
    await summarizer.ready;
  }
};
