import { useEffect, useRef } from "react";

export const generateSVG = (oww, existingTokenId) => {
  const XLine = 230;
  const MAXSymbolsInLline = 60;

  let messageFormatted = oww.message;
  let symbolsCounter = 2;
  let originalMessageLength = messageFormatted.length;
  while (symbolsCounter < originalMessageLength) {
    if (symbolsCounter % MAXSymbolsInLline === 1) {
      const previousText = messageFormatted.substring(0, symbolsCounter);
      const newPreviousText = previousText.replace(
        /[\s\.\,\:\;\!\?\-\=]([^\s\.\,\:\;\!\?\-\=]*)$/,
        "\n$1"
      );
      messageFormatted =
        newPreviousText + messageFormatted.substring(symbolsCounter);
      symbolsCounter += 1;
    }

    symbolsCounter += 1;
  }

  messageFormatted = `<tspan x="${XLine}" dy="0em">${messageFormatted}`;
  let counter = 0;
  while (messageFormatted.indexOf("\n") !== -1) {
    messageFormatted = messageFormatted.replace(
      "\n",
      `</tspan><tspan x="${XLine}" dy="${1.1}em">`
    );

    counter += 1;
    if (counter > 200) {
      break;
    }
  }

  messageFormatted += "</tspan>";

  return `
  <svg width="100%" height="auto" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
    <title>Twitter OWW</title>
    <g>
      <image
        id="author_image"
        stroke="null"
        x="229"
        y="52"
        width="50" 
        height="50"
        href="${oww.author_picture_url}"
      />
      <text
        id="author_name"
        fill="#000000"
        stroke="#000000"
        x="165"
        y="89.5"
        font-size="24"
        font-family="monospace"
        text-anchor="start"
        xml:space="preserve"
        font-weight="normal"
        font-style="normal"
      >
        ${oww.author_name}
      </text>
      <rect
        id="message_border"
        rx="10"
        fill="none"
        stroke="#1DA1F2"
        x="218"
        y="112.5"
        width="550"
        height="200"
      />
      <text
        id="message"
        x="0"
        y="135"
        fill="#000000"
        stroke="#000000"
        font-size="16"
        font-family="'Poppins'"
        text-anchor="start"
        xml:space="preserve"
        font-weight="normal"
        font-style="normal"
        stroke-width="0"
      >
        ${messageFormatted}
      </text>
      <g id="twitter_icon" stroke="null">
        <g id="svg_4" stroke="null">
          <path id="svg_5" class="st0" d="m742.9372,337.46104c0.02508,0.36901 0.02508,0.73803 0.02508,1.11044c0,11.3476 -8.49246,24.43483 -24.0213,24.43483l0,-0.0068c-4.58727,0.0068 -9.07925,-1.32981 -12.94098,-3.84999c0.66703,0.08163 1.3374,0.12244 2.00944,0.12414c3.80155,0.0034 7.49443,-1.2941 10.48518,-3.68334c-3.61264,-0.06972 -6.7806,-2.46576 -7.88729,-5.96374c1.26551,0.24828 2.56947,0.19726 3.81158,-0.14795c-3.93863,-0.80945 -6.77224,-4.32953 -6.77224,-8.4176c0,-0.03741 0,-0.07312 0,-0.10883c1.17356,0.66491 2.48756,1.03392 3.83164,1.07473c-3.7096,-2.52188 -4.85307,-7.54183 -2.61294,-11.46664c4.28635,5.36515 10.61056,8.62676 17.39952,8.97197c-0.6804,-2.98272 0.24909,-6.10828 2.44242,-8.20503c3.40033,-3.2514 8.74824,-3.08475 11.94462,0.37241c1.89074,-0.37922 3.70291,-1.08493 5.36129,-2.08484c-0.63025,1.98791 -1.94925,3.67653 -3.71127,4.74956c1.67342,-0.20066 3.30838,-0.6564 4.84806,-1.35192c-1.13344,1.72773 -2.56111,3.2327 -4.2128,4.44857l-0.00001,0.00003z" fill="#1D9BF0" stroke="null"/>
        </g>
      </g>
      <text
        id="oww_logo"
        transform="rotate(-90 83.7266 197)"
        stroke="#000000"
        font-style="normal"
        font-weight="normal"
        xml:space="preserve"
        text-anchor="start"
        font-family="'Raleway'"
        font-size="42"
        y="212.5"
        x="-190"
        stroke-width="0"
        fill="#A0AEC0"
      >
        Own Your Words
      </text>
      ${
        existingTokenId
          ? `
      <rect
        fill="#000000"
        stroke-width="0"
        x="-17.99998"
        y="-13.50002"
        width="844.99998"
        height="431.00002"
        opacity="0.5"
        stroke="#000000"
        id="error_minted_overlay"
      />
      <text
        fill="#F56565"
        stroke-width="0"
        x="40"
        y="200"
        font-size="42"
        font-family="monospace"
        text-anchor="start"
        xml:space="preserve"
        font-weight="normal"
        font-style="normal"
        stroke="#000000"
        transform="rotate(-24 327.974 163.466)"
        id="error_minted_text"
      >
        MINTED
      </text>
      <text
        fill="#F56565"
        stroke="#000000"
        stroke-width="0"
        x="80"
        y="250"
        font-size="42"
        font-family="monospace"
        text-anchor="start"
        xml:space="preserve"
        transform="rotate(-24 345.016 255.5)"
        id="error_minted_token_id"
      >
        #${existingTokenId}
      </text>
      `
          : ""
      }
    </g>
  </svg>
  `;
};

const OWWPreview = ({ oww, existingTokenId }) => {
  const wrapperDivRef = useRef();
  useEffect(() => {
    if (!oww) {
      return;
    }
    wrapperDivRef.current.innerHTML = "";
    const doc = new DOMParser().parseFromString(
      generateSVG(oww, existingTokenId),
      "application/xml"
    );
    wrapperDivRef.current.appendChild(
      wrapperDivRef.current.ownerDocument.importNode(doc.documentElement, true)
    );
  }, [oww, wrapperDivRef, existingTokenId]);

  return (
    <div
      style={{ background: "white", width: "100%", borderRadius: 6 }}
      ref={wrapperDivRef}
    />
  );
};

export default OWWPreview;
