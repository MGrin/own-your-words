import { useEffect, useCallback, useRef } from "react";
import { Timeline } from "react-twitter-widgets";
import { Text, VStack, Button, Center, Spacer } from "@chakra-ui/react";

const extractContractDataFromTweet = (twEl, auth) => {
  const authorNameEl = twEl.querySelector(".TweetAuthor-name.Identity-name");
  const authorPictureEl = twEl.querySelector(
    ".TweetAuthor-avatar > img.Avatar"
  );
  const messageEl = twEl.querySelector(".timeline-Tweet-text");

  let author_name = auth.screen_name;
  let author_picture_url = "";
  let message = "";

  if (authorNameEl) {
    author_name = authorNameEl.innerText;
  }

  if (authorPictureEl) {
    author_picture_url = authorPictureEl.dataset["src-2x"].replace(
      /_bigger/,
      ""
    );
  }

  if (messageEl) {
    message = messageEl.innerText;
  }

  return {
    sn_name: "twitter",
    author_id: auth.user_id,
    author_name,
    author_picture_url,
    post_id: twEl.dataset.tweetId,
    post_url: twEl.dataset.clickToOpenTarget,
    message,
  };
};

const attachButtonToTweet = (twEl, onClick) => {
  const tweetTextEl = twEl.querySelector(".timeline-Tweet-text");
  tweetTextEl
    .querySelectorAll("#own-your-words-btn")
    .forEach((b) => b.remove());

  const btn = document.createElement("button");
  btn.classList.add("timeline-ShowMoreButton");

  btn.id = "own-your-words-btn";
  btn.innerText = "Select this tweet.";
  btn.style.width = "100%";
  btn.style["background-color"] = "#55acee";
  btn.style.color = "#fff";
  btn.onclick = onClick;
  tweetTextEl.appendChild(btn);
};

const MAX_TRIES = 10;

const ListOfTweets = ({ auth, onSelect }) => {
  const tries = useRef(0);
  const amountOfFetchedTweets = useRef(0);

  const attachButtonsToTweets = useCallback(() => {
    const retry = (timeout = 200) => {
      tries.current += 1;
      if (tries.current < MAX_TRIES) {
        setTimeout(attachButtonsToTweets, timeout);
      }
    };
    const iframe = document.querySelector("iframe.twitter-timeline");
    if (!iframe) {
      return retry();
    }

    const iframeDocument = iframe.contentWindow.document;
    if (!iframeDocument) {
      return retry();
    }

    const tweetsElements = iframeDocument.querySelectorAll(".timeline-Tweet");
    if (tweetsElements.length === amountOfFetchedTweets.current) {
      return retry();
    }

    const tweetsObjects = [];

    tweetsElements.forEach((twEl) => {
      const data = extractContractDataFromTweet(twEl, auth);
      tweetsObjects.push(data);
      attachButtonToTweet(twEl, () => onSelect(data));
    });

    const loadMoreBtn = iframeDocument.querySelector(".timeline-LoadMore");
    if (loadMoreBtn) {
      loadMoreBtn.removeEventListener("click", attachButtonsToTweets);
      loadMoreBtn.addEventListener("click", attachButtonsToTweets);
    }

    amountOfFetchedTweets.current = tweetsObjects.length;
  }, [auth, onSelect]);

  useEffect(() => {
    attachButtonsToTweets();
  }, [attachButtonsToTweets]);

  return (
    <VStack>
      <Timeline
        dataSource={{
          sourceType: "profile",
          screenName: auth.screen_name,
        }}
        options={{
          height: "400",
        }}
      />
      <Text>
        Click on "Select this tween" button inside the Twitter timeline
      </Text>
      <Center>
        <Button size="xs" variant="ghost" onClick={attachButtonsToTweets}>
          Reload tweets
        </Button>
      </Center>
    </VStack>
  );
};

export default ListOfTweets;
