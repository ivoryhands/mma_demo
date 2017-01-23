import React, { Component } from 'react';

class LiveGradient extends Component {

  render() {

      return (
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlnsXlink="http://www.w3.org/1999/xlink" width="64px" height="64px">



          <text x="50%" textAnchor="middle" y="50%" dy="0.2em" fill="url(#pattern)" fontFamily="Open Sans Condensed" fontSize="7vh">LIVE</text>

          <defs>

            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0">
              <stop offset="0%" style={{stopColor:"#33235b"}}/>
              <stop offset="25%" style={{stopColor:"#D62229"}}/>
              <stop offset="50%" style={{stopColor:"#E97639"}}/>
              <stop offset="75%" style={{stopColor:"#792042"}}/>
              <stop offset="100%" style={{stopColor:"#33235b"}}/>
            </linearGradient>


            <pattern id="pattern" x="0" y="0" width="300%" height="100%" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="150%" height="100%" fill="url(#gradient)">
                <animate attributeType="XML"
                         attributeName="x"
                         from="0" to="150%"
                         dur="7s"
                         repeatCount="indefinite"/>
              </rect>
              <rect x="-150%" y="0" width="150%" height="100%" fill="url(#gradient)">
                <animate attributeType="XML"
                         attributeName="x"
                         from="-150%" to="0"
                         dur="7s"
                         repeatCount="indefinite"/>
              </rect>
            </pattern>


            <font horizAdvX="1024" >
              <fontFace fontFamily="sonos-logoregular" unitsPerEm="2048" ascent="1920" descent="-128" />
              <missing-glyph horizAdvX="500" />
              <glyph unicode="&#xd;" horizAdvX="682" />
              <glyph unicode=" " />
              <glyph unicode="N" horizAdvX="812" d="M0 412h150v636l662 -664v1000h-148v-640l-664 664v-996z" />
              <glyph unicode="O" horizAdvX="1946" d="M470 896q0 210 150 364q148 148 362 148t362 -148q150 -154 150 -364q0 -212 -150 -362t-362 -150t-362 150t-150 362zM620 896q0 -152 106 -258q104 -108 256 -108q154 0 256 108q108 108 108 258q0 148 -108 260q-104 108 -256 108q-148 0 -256 -108 q-106 -110 -106 -260z" />
              <glyph unicode="S" horizAdvX="674" d="M0 1124q0 -58 26 -110q28 -52 80 -90q32 -26 86 -52q68 -30 124 -46q124 -40 174 -84q34 -30 34 -74q0 -52 -48 -92q-56 -42 -138 -42q-62 0 -122 26q-38 16 -72 40l-118 -80q0 -4 24 -24q24 -24 60 -46q108 -66 228 -66q70 0 132 22q66 24 108 62q44 38 72 92 q24 54 24 110q0 54 -26 110q-28 52 -78 90q-34 28 -88 52q-38 18 -122 46q-122 36 -174 82q-36 32 -36 74q0 54 50 92q54 44 138 44q60 0 120 -26q32 -12 72 -40l120 80q-2 0 -24 24q-18 18 -62 46q-104 64 -226 64q-74 0 -132 -20t-110 -62q-48 -44 -70 -92 q-26 -56 -26 -110z" />
              <glyph unicode="&#xa0;" />
              <glyph unicode="&#x2000;" horizAdvX="704" />
              <glyph unicode="&#x2001;" horizAdvX="1408" />
              <glyph unicode="&#x2002;" horizAdvX="704" />
              <glyph unicode="&#x2003;" horizAdvX="1408" />
              <glyph unicode="&#x2004;" horizAdvX="469" />
              <glyph unicode="&#x2005;" horizAdvX="352" />
              <glyph unicode="&#x2006;" horizAdvX="234" />
              <glyph unicode="&#x2007;" horizAdvX="234" />
              <glyph unicode="&#x2008;" horizAdvX="176" />
              <glyph unicode="&#x2009;" horizAdvX="281" />
              <glyph unicode="&#x200a;" horizAdvX="78" />
              <glyph unicode="&#x202f;" horizAdvX="281" />
              <glyph unicode="&#x205f;" horizAdvX="352" />
              <glyph unicode="&#x25fc;" horizAdvX="1000" d="M0 0z" />
            </font>
          </defs>
        </svg>
      </div>
    );
  }


}

export default LiveGradient;
