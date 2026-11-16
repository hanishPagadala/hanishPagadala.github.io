import { useId } from 'react'

export default function Drawing({ kind, angle = 26 }: { kind: string; angle?: number }) {
  const patternId = useId()
  return <svg viewBox="0 0 600 360" fill="none" aria-hidden="true" className={`drawing drawing-${kind}`}>
    <defs><pattern id={patternId} width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" stroke="currentColor" strokeWidth=".5" opacity=".15" /></pattern></defs>
    <rect width="600" height="360" fill={`url(#${patternId})`} />
    {kind === 'wing' ? <>
      <ellipse cx="300" cy="182" rx="183" ry="119" stroke="currentColor" strokeDasharray="4 7" opacity=".2" />
      <path d="M70 182H530M300 34V328" stroke="currentColor" strokeDasharray="5 7" opacity=".25" />
      <g transform={`rotate(${angle} 300 180)`} className="wing-geometry"><path d="M88 174 280 149 510 169 513 188 310 197 90 190Z" fill="var(--wing-fill)" stroke="currentColor" strokeWidth="2" /><path d="M110 180 489 179M171 164V192M232 156V195M366 158V194M433 164V191" stroke="currentColor" opacity=".4" /></g>
      <path d="M299 71C284 92 283 123 285 146L280 240 267 263 267 274 299 265 332 274 332 263 319 240 315 146C317 123 314 92 299 71Z" fill="var(--aircraft-fill)" stroke="currentColor" strokeWidth="2" />
      <path d="M299 90V247M289 120Q300 110 311 120L313 143H287Z" stroke="currentColor" opacity=".55" />
      <path d="M383 93H482V71M163 247H99V272" stroke="currentColor" opacity=".5" /><circle cx="383" cy="93" r="3" fill="currentColor" /><circle cx="163" cy="247" r="3" fill="currentColor" />
      <text x="405" y="62">VARIABLE SWEEP</text><text x="65" y="292">AIRFRAME / TOP VIEW</text>
    </> : kind === 'wheel' ? <>
      <path d="m173 122 129-60 140 76v124l-132 57-137-76Z" stroke="currentColor" opacity=".35" /><path d="m173 122 137 71 132-55M310 193v126" stroke="currentColor" opacity=".35" />
      <ellipse cx="305" cy="186" rx="89" ry="109" transform="rotate(-30 305 186)" fill="var(--wing-fill)" stroke="currentColor" strokeWidth="2" /><ellipse cx="305" cy="186" rx="63" ry="79" transform="rotate(-30 305 186)" stroke="currentColor" /><ellipse cx="305" cy="186" rx="17" ry="22" transform="rotate(-30 305 186)" fill="var(--aircraft-fill)" stroke="currentColor" strokeWidth="2" />
      <path d="m268 130 27 40m21 32 28 39m-94-33 37-15m37-15 38-15M131 92c-26 49-24 97 5 134m-17-7 17 7 3-19" stroke="currentColor" /><text x="77" y="273">ANGULAR MOMENTUM</text>
    </> : <>
      <path d="m73 139 72-38 65 36v92l-71 38-66-37Zm320 0 72-38 65 36v92l-71 38-66-37Z" fill="var(--wing-fill)" stroke="currentColor" /><path d="m73 139 66 37 71-39m-71 39v91m254-128 66 37 71-39m-71 39v91" stroke="currentColor" opacity=".5" />
      <path d="M183 184H423M183 169H423M183 199H423" stroke="currentColor" strokeDasharray="6 8" opacity=".35" /><path d="M211 185q14-52 28 0t28 0t28 0t28 0t28 0t28 0t28 0" stroke="currentColor" strokeWidth="2" /><text x="90" y="299">TX</text><text x="454" y="299">RX</text><text x="236" y="81">OPTICAL LINK</text>
    </>}
    <path d="M18 40V18H40M560 18h22v22M18 320v22h22m520 0h22v-22" stroke="currentColor" opacity=".4" />
  </svg>
}


