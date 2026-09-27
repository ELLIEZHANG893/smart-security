/* Camera compositions share a perspective and retain the same scene across keyframes. */
const cameraArt = (() => {
  let serial = 0;
  return function cameraArt(camera = 'living', type = 'idle', phase = 1) {
    const p = Math.max(0, Math.min(2, Number(phase) || 0));
    const k = 'camArt' + (++serial) + '-';
    const ref = name => `url(#${k}${name})`;
    const shadow = (x, y, rx, ry, opacity = .15) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#24352e" opacity="${opacity}" filter="${ref('blur')}"/>`;
    const parcel = (x, y, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 8 19 0 46 9 28 18Z" fill="#d2b98e"/><path d="M0 8 28 18 28 48 0 37Z" fill="#b89a70"/><path d="M28 18 46 9 46 38 28 48Z" fill="#947851"/><path d="m11 3 28 10 0 10-6 3V16L5 6Z" fill="#ddd0ab"/><path d="m5 22 14 5v9L5 31Z" fill="#ebe6d6"/><path d="m8 25 9 3m-9 0 7 2" stroke="#a7a498" stroke-width="1"/></g>`;
    const cat = (x, y, pose = 0, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})">${shadow(0, 13, 28, 5)}<path d="M-20 0Q-44-23-40-30Q-34-32-34-22Q-29-14-14-10" fill="none" stroke="#bd8f5f" stroke-width="7" stroke-linecap="round"/><ellipse cx="-2" cy="-3" rx="24" ry="13" fill="${ref('fur')}" transform="rotate(${pose === 1 ? 12 : -3})"/><path d="M-18 2-20 14m13-11 2 13m17-12 0 11m7-12 2 10" stroke="#ac7d4f" stroke-width="6" stroke-linecap="round"/><g transform="translate(${pose === 1 ? '21 9' : '21 -10'}) rotate(${pose === 1 ? 38 : -5})"><path d="m-10-4-1-12 10 8 9-8 2 13" fill="#b58556"/><ellipse cx="0" cy="0" rx="12" ry="10" fill="#d5ad7b"/><path d="m-9-11 4 4m11-4-4 4" stroke="#b98771" stroke-width="3"/><ellipse cx="5" cy="2" rx="7" ry="4" fill="#e8c798"/><circle cx="-3" cy="-1" r="1.3" fill="#414234"/><circle cx="6" cy="-2" r="1.2" fill="#414234"/><path d="m10 1 2 1-2 2" fill="#755847"/><path d="m3-7-1 3m-6-3 1 3" stroke="#a5784c" stroke-width="2"/></g><path d="m-15-10 2 8m7-11 1 8m8-7 0 6" stroke="#b58555" stroke-width="2" opacity=".75"/></g>`;
    const person = (x, y, pose = 'stand', scale = 1, coat = '#87938d') => {
      let body;
      if (pose === 'fallen') {
        body = `<path d="M-34-6 2-3 23 8" fill="none" stroke="#666d68" stroke-width="12" stroke-linecap="round"/><path d="M-34-6-1 9 30 13" fill="none" stroke="#777d76" stroke-width="11" stroke-linecap="round"/><path d="M-63-10-32-8" stroke="${coat}" stroke-width="24" stroke-linecap="round"/><path d="M-53-7-39 10-24 14" fill="none" stroke="${coat}" stroke-width="8" stroke-linecap="round"/><circle cx="-79" cy="-12" r="11" fill="#c4a181"/><path d="M-89-9Q-94-22-81-25Q-69-24-69-16" fill="#4b514b"/><path d="m27 12 8 1m-13-5 8 2" stroke="#4c5550" stroke-width="6" stroke-linecap="round"/>`;
      } else if (pose === 'sit' || pose === 'sleep') {
        if (pose === 'sleep') {
          body = `<path d="M-53-21-3-19 40-16" stroke="#8d9b8b" stroke-width="24" stroke-linecap="round"/><path d="m-8-9 38 1" stroke="#c6ba9e" stroke-width="12" stroke-linecap="round"/><circle cx="-68" cy="-23" r="12" fill="#caaa8a"/><path d="M-79-24Q-78-38-65-35Q-54-32-56-22" fill="#4b514b"/><path d="M-52-10 25-7" stroke="#d0c2a7" stroke-width="10" stroke-linecap="round"/>`;
        } else {
          body = `<path d="M-5-35 20-22 21 7m-23-40-14 17 6 29" fill="none" stroke="#707971" stroke-width="12" stroke-linecap="round"/><path d="M-8-73-4-37" stroke="${coat}" stroke-width="25" stroke-linecap="round"/><path d="M-18-67-29-43-7-38M3-66 16-46 5-37" fill="none" stroke="${coat}" stroke-width="8" stroke-linecap="round"/><circle cx="-9" cy="-96" r="11" fill="#c4a181"/><path d="M-20-96Q-20-112-8-109Q5-108 3-97" fill="#535953"/><path d="m-10 12 9 1m20-5 9 1" stroke="#505a54" stroke-width="7" stroke-linecap="round"/>`;
        }
      } else if (pose === 'bend') {
        body = `<path d="M-14-54-20-28-14-1m7-53 17 25 1 29" fill="none" stroke="#6c7770" stroke-width="11" stroke-linecap="round"/><path d="M-8-57 13-76" stroke="${coat}" stroke-width="25" stroke-linecap="round"/><circle cx="30" cy="-84" r="10" fill="#c4a181"/><path d="M19-85Q21-99 34-94Q43-90 39-82" fill="#4c534d"/><path d="M11-70 27-48 32-29" fill="none" stroke="${coat}" stroke-width="8" stroke-linecap="round"/><path d="m32-29 1 7" stroke="#c4a181" stroke-width="6" stroke-linecap="round"/><path d="m-15 0 10 1m16 0 10 1" stroke="#424f48" stroke-width="7" stroke-linecap="round"/>`;
      } else {
        body = `<path d="M-9-53${pose === 'walk' ? '-23-26-30-1m28-53 17 31 1 22' : '-11-26-13-1m15-53 7 26 5 27'}" fill="none" stroke="#6c7770" stroke-width="11" stroke-linecap="round"/><path d="M-5-96-5-55" stroke="${coat}" stroke-width="28" stroke-linecap="round"/><path d="M-20-92${pose === 'carry' ? '-29-73-3-70' : '-25-66-18-51'}M9-92${pose === 'carry' ? '21-72 0-70' : '15-70 10-53'}" fill="none" stroke="${coat}" stroke-width="9" stroke-linecap="round"/><path d="M-5-114V-104" stroke="#c4a181" stroke-width="9"/><ellipse cx="-5" cy="-124" rx="11" ry="13" fill="#c4a181"/><path d="M-16-123Q-21-140-4-140Q9-137 6-123L1-130-12-130Z" fill="#48514b"/><path d="${pose === 'walk' ? 'm-31 0 11 2m33-1 11 1' : 'm-14 0 10 2m10-1 10 1'}" stroke="#424f48" stroke-width="7" stroke-linecap="round"/>${pose === 'carry' ? parcel(-19, -77, .8) : ''}`;
      }
      return `<g transform="translate(${x} ${y}) scale(${scale})">${shadow(pose === 'fallen' ? -28 : 0, 5, pose === 'fallen' ? 68 : 27, 6)}${body}</g>`;
    };
    const defs = `<defs>
      <linearGradient id="${k}wall" x1="0" y1="0" x2=".8" y2="1"><stop stop-color="#dddcd0"/><stop offset=".56" stop-color="#eae7da"/><stop offset="1" stop-color="#d4d5c8"/></linearGradient>
      <linearGradient id="${k}floor" x1="0" y1="0" x2=".3" y2="1"><stop stop-color="#bcb399"/><stop offset=".45" stop-color="#d3c7ac"/><stop offset="1" stop-color="#baaa8e"/></linearGradient>
      <linearGradient id="${k}outside" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${type === 'rain' ? '#829b9d' : '#a3bfba'}"/><stop offset="1" stop-color="${type === 'rain' ? '#bdc8bd' : '#d4d9b6'}"/></linearGradient>
      <linearGradient id="${k}curtain" x1="0" y1="0" x2="1" y2=".1"><stop stop-color="#bcbfb0"/><stop offset=".16" stop-color="#e6e6d7"/><stop offset=".38" stop-color="#cfd2c1"/><stop offset=".58" stop-color="#e4e6d9"/><stop offset=".77" stop-color="#c7cdbd"/><stop offset="1" stop-color="#f0eee0"/></linearGradient>
      <linearGradient id="${k}sofa" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#c9bb9f"/><stop offset=".55" stop-color="#bbae93"/><stop offset="1" stop-color="#9d9079"/></linearGradient>
      <linearGradient id="${k}seat" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#e0d1b4"/><stop offset="1" stop-color="#b5a78e"/></linearGradient>
      <linearGradient id="${k}wood" x1="0" y1="0" x2=".2" y2="1"><stop stop-color="#bf9f73"/><stop offset="1" stop-color="#8a6e4b"/></linearGradient>
      <linearGradient id="${k}fur" x1="0" y1="0" x2=".5" y2="1"><stop stop-color="#dec096"/><stop offset="1" stop-color="#b38658"/></linearGradient>
      <radialGradient id="${k}glow" cx=".18" cy=".23" r=".9"><stop stop-color="#fff8dc" stop-opacity=".28"/><stop offset="1" stop-color="#fff8dc" stop-opacity="0"/></radialGradient>
      <radialGradient id="${k}vignette" cx=".5" cy=".45" r=".72"><stop offset=".5" stop-color="#243126" stop-opacity="0"/><stop offset="1" stop-color="#243126" stop-opacity=".25"/></radialGradient>
      <filter id="${k}blur" x="-50%" y="-100%" width="200%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
      <filter id="${k}grain"><feTurbulence type="fractalNoise" baseFrequency=".82" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".035"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter>
      <clipPath id="${k}window"><path d="M72 43 221 36 221 184 72 188Z"/></clipPath>
      <pattern id="${k}weave" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 1H5M1 0V5" stroke="#d1d4c2" stroke-width=".5" opacity=".4"/></pattern>
    </defs>`;
    const floor = `<path d="M0 216 569 206 640 235V360H0Z" fill="${ref('floor')}"/><g stroke="#857a61" stroke-opacity=".2" stroke-width="1"><path d="m78 216-48 144M182 214l-16 146m113-148 15 148m83-149 48 149m50-151 85 151m6-152 74 88"/><path d="M0 245 640 243M0 287 640 284M0 341 640 338"/><path d="m94 245 40 0m62 40 43 0m82 55 45 0"/></g>`;
    const room = () => {
      const rain = type === 'rain';
      const openWindow = rain;
      const aperture = [40, 30, 48][p];
      return `<path d="M0 0H569V210L0 220Z" fill="${ref('wall')}"/><path d="M569 0H640V237L569 210Z" fill="#cfd1c5"/>
        ${floor}<path d="M0 216 569 207 640 235" stroke="#aaa998" stroke-width="5"/><path d="M0 219 569 211 640 239" stroke="#f0ecdc" stroke-width="2"/>
        <path d="M53 30 229 22V199L53 204Z" fill="#acae9e"/><path d="M62 35 228 29V194L62 197Z" fill="#f1f0e0"/>
        <g clip-path="${ref('window')}"><path d="M65 30H232V197H65Z" fill="${ref('outside')}"/><path d="M65 126 102 117 134 122 157 110 184 125 221 108V193H65Z" fill="#8aa491" opacity=".6"/><path d="M79 142V82h30v80m13-27V72h24v88m32-22V89h43v77" fill="#b5c3b4" opacity=".6"/><path d="M64 177q17-44 47-4 29-37 43 1 30-48 51-2 17-20 39-5v41H64Z" fill="#768f71" opacity=".7"/>${rain ? `<g stroke="#e9f3ed" stroke-opacity="${p === 0 ? '.28' : '.56'}" stroke-width="1">${Array.from({length:20}, (_, i) => `<path d="m${69 + (i * 31) % 160} ${40 + (i * 23) % 128}-7 17"/>`).join('')}</g>` : ''}</g>
        <path d="M72 43 221 36 221 184 72 188Z" fill="none" stroke="#eaedde" stroke-width="5"/><path d="m147 39 0 147M73 119l148-4" stroke="#e9ebdd" stroke-width="5"/>
        ${openWindow ? `<path d="m153 43 ${aperture} ${p === 1 ? 14 : 9}v${p === 1 ? 113 : 121}l-${aperture} ${p === 1 ? 10 : 7}Z" fill="#b8ccc2" fill-opacity=".18" stroke="#eeefe0" stroke-width="5"/><path d="M${153 + aperture - 1} 113h-7" stroke="#929d91" stroke-width="3"/>` : '<path d="M155 111h8" stroke="#939b8b" stroke-width="3"/>'}
        <path d="M57 28Q67 73 52 126L51 207 80 204Q69 136 87 27Z" fill="${ref('curtain')}"/><path d="M215 22Q213 78 ${rain && p === 1 ? '246 146L244 204 210 200Q230 126 196' : '222 137L236 199 207 198Q208 139 201'} 23Z" fill="${ref('curtain')}"/><path d="m49 24 187-8" stroke="#989e8c" stroke-width="4"/>
        <path d="M73 197 199 189 373 287 167 287Z" fill="#fff6ce" opacity="${rain ? '.07' : '.20'}"/>
        <g transform="translate(298 59)"><rect width="75" height="74" rx="1" fill="#adab97"/><rect x="4" y="4" width="67" height="66" fill="#edeada"/><path d="M16 57 36 22 59 56Z" fill="#a6b09a"/><circle cx="50" cy="21" r="9" fill="#c8ba8b"/><path d="M12 59H63" stroke="#c1c3b0"/></g>
        ${shadow(388, 241, 154, 13, .18)}
        <path d="M255 176Q252 160 266 157L472 153Q488 153 491 169L498 228 260 237Z" fill="${ref('sofa')}"/>
        <path d="M271 168Q273 163 280 165L362 162Q369 163 370 170L372 206 267 211Z" fill="#d0c4ab"/><path d="M377 168Q377 161 384 162L468 160Q477 161 478 169L485 202 376 206Z" fill="#c9bda4"/>
        <path d="M267 210 376 206 384 225 260 231Z" fill="${ref('seat')}"/><path d="M376 206 485 202 496 220 384 225Z" fill="${ref('seat')}"/>
        <path d="M260 230 496 219 496 240 260 249Z" fill="#b1a389"/><path d="M264 233 491 223" stroke="#d7c7ac" stroke-opacity=".55"/>
        <path d="M245 194Q244 184 254 183L268 182 268 243 247 245Z" fill="${ref('sofa')}"/><path d="M486 183Q486 174 496 175L509 177 515 236 495 240Z" fill="${ref('sofa')}"/>
        <path d="m264 248 0 9m229-17 2 9" stroke="#655d48" stroke-width="5"/>
        <path d="m288 176 24-3 7 31-26 3Z" fill="#839685"/><path d="m428 169 25 3-7 30-25-4Z" fill="#c0b18f"/><path d="m315 171 20 4-7 29-21-5Z" fill="#e4d6b9"/>
        ${type === 'wake' ? person(384, p === 1 ? 220 : 219, 'sleep', .72, '#9fae9d') : ''}
        ${type === 'health' || type === 'night_activity' ? person(394, p === 1 ? 235 : 234, 'sit', .7, '#91a095') : ''}
        <path d="m223 249 257-15 74 89-361 11Z" fill="#9ea997"/><path d="m223 249 257-15 74 89-361 11Z" fill="${ref('weave')}"/><path d="m223 252 254-14 69 82-347 10Z" fill="none" stroke="#c1c6b2" opacity=".45"/>
        ${shadow(368, 290, 65, 8)}<path d="m318 268-7 40m98-44 9 39" stroke="#9b896b" stroke-width="5"/><ellipse cx="362" cy="266" rx="64" ry="26" fill="#9b8767"/><ellipse cx="362" cy="261" rx="64" ry="24" fill="#d9c9a8"/><ellipse cx="362" cy="259" rx="60" ry="20" fill="#ddceb1"/>
        <path d="m337 253 32-3 10 6-33 4Z" fill="#929e8f"/><path d="m339 250 31-3 8 6-32 3Z" fill="#ebe6d3"/><ellipse cx="389" cy="254" rx="8" ry="3" fill="#a89677"/><path d="M383 244v9q6 4 12-1v-9Z" fill="#edead9"/><ellipse cx="389" cy="243" rx="6" ry="2.5" fill="#9a8e71"/><path d="M395 245q9-1 5 6l-5 1" stroke="#ded7c1" fill="none" stroke-width="2"/>
        <path d="M525 147 523 215m-15-1h29" stroke="#7e8271" stroke-width="3"/><path d="m508 128-6 26 43-2-10-26Z" fill="#d8cfaf"/><path d="m507 152 32-1" stroke="#f0e6c5" stroke-width="2"/>
        <g transform="translate(564 223)"><path d="M-15-3-10 29H12L18-3Z" fill="#b39177"/><ellipse cy="-3" rx="17" ry="6" fill="#c9a88b"/><ellipse cy="-4" rx="13" ry="4" fill="#665e47"/><path d="M0-5V-61M0-23l-18-22M0-31l21-25M0-47l-10-25M0-19l24-8" stroke="#758b61" stroke-width="3"/><g fill="#6e8661"><ellipse cx="-17" cy="-42" rx="8" ry="18" transform="rotate(-42 -17 -42)"/><ellipse cx="19" cy="-52" rx="8" ry="18" transform="rotate(43 19 -52)"/><ellipse cx="-9" cy="-65" rx="7" ry="17" transform="rotate(-19 -9 -65)"/><ellipse cx="23" cy="-27" rx="8" ry="18" transform="rotate(67 23 -27)"/></g></g>
        ${shadow(167, 281, 26, 6)}<ellipse cx="168" cy="278" rx="26" ry="10" fill="#899991"/><path d="M143 275q1 18 25 17 25 0 26-17" fill="#b5c1b5"/><ellipse cx="168" cy="275" rx="26" ry="9" fill="#d1d8c9"/><ellipse cx="168" cy="275" rx="19" ry="5.8" fill="#809b9d"/><path d="m157 274q10-3 20 0" stroke="#d2e1d6" stroke-width="1.3" fill="none"/>
        ${type === 'food' ? `${shadow(229, 309, 25, 5)}<path d="M205 303q1 15 24 15 22-1 24-15" fill="#bca487"/><ellipse cx="229" cy="303" rx="24" ry="8" fill="#d8c4a2"/><ellipse cx="229" cy="303" rx="18" ry="5" fill="#9a7751"/><g fill="#b99763"><ellipse cx="219" cy="302" rx="2.8" ry="1.8"/><ellipse cx="226" cy="301" rx="2.4" ry="1.8"/><ellipse cx="233" cy="303" rx="2.7" ry="1.7"/><ellipse cx="239" cy="301" rx="2.8" ry="1.6"/><ellipse cx="223" cy="305" rx="2.7" ry="1.7"/><ellipse cx="237" cy="306" rx="2.8" ry="1.6"/></g>${cat(p === 0 ? 165 : p === 1 ? 199 : 302, p === 0 ? 328 : p === 1 ? 296 : 329, p === 1 ? 1 : 0, .76)}` : ''}
        ${type === 'damage' ? `<g transform="translate(${p === 0 ? '281 256' : p === 1 ? '277 258' : '271 268'}) rotate(${p === 0 ? -8 : p === 1 ? 15 : -21})">${shadow(0, 8, 18, 4)}<path d="M-16-8Q0-13 16-8L14 11Q0 16-16 9Z" fill="#93a18a"/><path d="M-13-6Q0-10 13-6L11 9Q0 12-13 7Z" stroke="#c1c7aa" stroke-width="1"/><path d="M-16-4l-5 1m5 4-5 2m7 4-4 2" stroke="#9bab8a" stroke-width="1.5"/></g>${cat(p === 0 ? 222 : p === 1 ? 248 : 242, p === 0 ? 277 : p === 1 ? 248 : 258, p === 0 ? 0 : 1, .75)}` : ''}
        ${type === 'pet' ? cat(p === 0 ? 108 : p === 1 ? 132 : 209, p === 1 ? 269 : 292, p === 1 ? 1 : 0, .8) : type === 'idle' ? cat(428, 322, 0, .72) : type === 'pet_wait' ? `<g transform="translate(${p === 1 ? 79 : 96} 0) scale(-1 1)">${cat(0,p===1?290:286,0,.8)}</g>` : ''}
        ${rain && p > 0 ? `<ellipse cx="132" cy="229" rx="${p === 1 ? 31 : 37}" ry="8" fill="#a2b5ad" opacity=".38"/><path d="m111 227q17-4 34-1m-23 6 14-1" stroke="#cfdbcd" opacity=".55"/>` : ''}
        ${type === 'fall' ? person(p === 0 ? 230 : p === 1 ? 220 : 264, p === 0 ? 296 : p === 1 ? 301 : 317, p === 0 ? 'stand' : p === 1 ? 'bend' : 'fallen', .82, '#a6afa0') : ''}
        ${type === 'leave' ? person(p === 0 ? 200 : p === 1 ? 88 : 12, p === 0 ? 299 : p === 1 ? 274 : 263, 'walk', .77, '#82938a') : ''}
      `;
    };
    const hall = () => {
      const human = type === 'delivery' || type === 'visitor' || type === 'leave';
      const doorOpen = type === 'leave' && p === 0;
      return `<path d="M0 0H640V360H0Z" fill="#d7d6c9"/><path d="M0 0 116 49 116 230 0 312Z" fill="#c2c5b8"/><path d="M116 49 536 43 536 229 116 230Z" fill="${ref('wall')}"/><path d="M536 43 640 0V305L536 229Z" fill="#cdd0c2"/>
        <path d="M116 230 536 229 640 305V360H0V312Z" fill="${ref('floor')}"/><g fill="none" stroke="#8f8c77" stroke-opacity=".35"><path d="M116 230 0 312m220-82-64 130m188-130 8 130m97-130 90 130m-531-86h575M0 321H640"/></g><path d="M0 310 115 228 536 227 640 303" stroke="#acae9c" stroke-width="5"/>
        <path d="M206 45 398 44 398 237 206 237Z" fill="#817d68"/><path d="M215 50 390 49 390 231 215 231Z" fill="#474f43"/>
        ${doorOpen ? '<path d="M225 56 317 77 317 244 225 227Z" fill="#9c997f"/><path d="M234 67 305 84 305 228 234 216Z" fill="#a9a58a"/><path d="M295 154v16" stroke="#d2cbb1" stroke-width="4"/><path d="M320 55 387 55V230h-67Z" fill="#777e6b"/>' : `<path d="M224 56 383 55 383 227 224 228Z" fill="#9f9d84"/><path d="M234 64 373 63 373 218 234 219Z" fill="#aba58b"/><path d="M244 72 363 71V207L244 210Z" fill="none" stroke="#898873"/><circle cx="303" cy="109" r="3" fill="#646d5d"/><path d="M359 149v24" stroke="#7a806e" stroke-width="8" stroke-linecap="round"/><path d="m357 155-17 1" stroke="#c9c7ae" stroke-width="4"/>`}
        <path d="M198 233h209v9H198Z" fill="#b0ae94"/><path d="M210 250 392 250 426 289 176 289Z" fill="#7f8a79"/><path d="M217 256 385 256 406 281 192 281Z" fill="none" stroke="#b0b49c" opacity=".45"/>
        <path d="M115 141 181 138 181 245 115 250Z" fill="#aca58c"/><path d="M116 150 176 146 176 242 116 247Z" fill="#bcb69a"/><path d="M145 149V244" stroke="#999983"/><path d="M138 183v18m15-18v17" stroke="#827f68" stroke-width="2"/><path d="M107 136 183 131 190 139 114 145Z" fill="#d8cdb0"/>
        <ellipse cx="148" cy="133" rx="14" ry="4" fill="#8c8f78"/><path d="M137 119v13q12 8 23-1v-13Z" fill="#e4dec6"/><ellipse cx="148" cy="118" rx="12" ry="4" fill="#686e50"/><path d="M147 118 144 89m4 17 16-18m-18 12-16-13" stroke="#68815b" stroke-width="2"/><g fill="#839765"><ellipse cx="143" cy="88" rx="5" ry="12" transform="rotate(-17 143 88)"/><ellipse cx="160" cy="90" rx="5" ry="12" transform="rotate(47 160 90)"/><ellipse cx="132" cy="87" rx="5" ry="11" transform="rotate(-40 132 87)"/></g>
        <path d="M443 88h48v62h-48Z" fill="#939985"/><path d="M447 92h40v54h-40Z" fill="#e4e3cf"/><path d="M452 132 465 102l19 30Z" fill="#9dad8f"/>
        <path d="M512 61 522 59V94l-10 3Z" fill="#e9e6d2"/><path d="M512 97v27" stroke="#cccbb4"/>
        ${shadow(487, 258, 28, 7)}<path d="M470 232 465 264 512 265 505 232Z" fill="#bbab8a"/><path d="M467 232 508 232 503 219 472 219Z" fill="#d0c2a3"/><path d="M473 222h29" stroke="#ad9d7c"/>
        ${type === 'delivery' && p > 0 ? parcel(402, 261, .82) : ''}
        ${human ? type === 'delivery' ? person(p === 0 ? 343 : p === 1 ? 356 : 372, p === 0 ? 290 : p === 1 ? 292 : 291, p === 0 ? 'carry' : p === 1 ? 'bend' : 'stand', .99, '#7f8e8c') : type === 'visitor' ? person(p === 0 ? 341 : p === 1 ? 337 : 339, p === 1 ? 283 : 284, 'stand', .97, '#9f9f8c') : p < 2 ? person(p === 0 ? 270 : 411, p === 0 ? 248 : 316, 'walk', p === 0 ? .75 : 1.05, '#879b8e') : '' : ''}
      `;
    };
    return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="none" aria-hidden="true">${defs}<g filter="${ref('grain')}">${camera === 'door' ? hall() : room()}</g><path d="M0 0H640V360H0Z" fill="${ref('glow')}"/>${type==='night_activity'?`<path d="M0 0H640V360H0Z" fill="#102229" opacity=".4"/><path d="M72 43 221 36 221 184 72 188Z" fill="#1f363c" opacity=".75"/><ellipse cx="524" cy="163" rx="78" ry="88" fill="#fae1a2" opacity=".15"/><path d="m508 128-6 26 43-2-10-26Z" fill="#e9d294"/>`:''}<path d="M0 0H640V360H0Z" fill="${ref('vignette')}"/></svg>`;
  };
})();
