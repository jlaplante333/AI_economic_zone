import React from 'react';

const FlagDisplay = ({ countryCode, className = '' }) => {
  // Flag image mapping - using realistic flag PNGs
  const flagImages = {
    'en': 'https://flagcdn.com/w80/us.png',
    'es': 'https://flagcdn.com/w80/es.png',
    'zh': 'https://flagcdn.com/w80/cn.png',
    'vi': 'https://flagcdn.com/w80/vn.png',
    'tl': 'https://flagcdn.com/w80/ph.png',
    'ar': 'https://flagcdn.com/w80/sa.png',
    'ko': 'https://flagcdn.com/w80/kr.png',
    'hi': 'https://flagcdn.com/w80/in.png',
    'th': 'https://flagcdn.com/w80/th.png',
    'ja': 'https://flagcdn.com/w80/jp.png',
    'ru': 'https://flagcdn.com/w80/ru.png',
    'fr': 'https://flagcdn.com/w80/fr.png',
    'pt': 'https://flagcdn.com/w80/pt.png',
    'de': 'https://flagcdn.com/w80/de.png',
    'it': 'https://flagcdn.com/w80/it.png',
    'tr': 'https://flagcdn.com/w80/tr.png',
    'nl': 'https://flagcdn.com/w80/nl.png',
    'sv': 'https://flagcdn.com/w80/se.png',
    'no': 'https://flagcdn.com/w80/no.png',
    'da': 'https://flagcdn.com/w80/dk.png',
    'fi': 'https://flagcdn.com/w80/fi.png',
    'pl': 'https://flagcdn.com/w80/pl.png',
    'cs': 'https://flagcdn.com/w80/cz.png',
    'sk': 'https://flagcdn.com/w80/sk.png',
    'hu': 'https://flagcdn.com/w80/hu.png',
    'ro': 'https://flagcdn.com/w80/ro.png',
    'bg': 'https://flagcdn.com/w80/bg.png',
    'hr': 'https://flagcdn.com/w80/hr.png',
    'sr': 'https://flagcdn.com/w80/rs.png',
    'sl': 'https://flagcdn.com/w80/si.png',
    'et': 'https://flagcdn.com/w80/ee.png',
    'lv': 'https://flagcdn.com/w80/lv.png',
    'lt': 'https://flagcdn.com/w80/lt.png',
    'el': 'https://flagcdn.com/w80/gr.png',
    'he': 'https://flagcdn.com/w80/il.png',
    'id': 'https://flagcdn.com/w80/id.png',
    'ms': 'https://flagcdn.com/w80/my.png',
    'bn': 'https://flagcdn.com/w80/bd.png',
    'ur': 'https://flagcdn.com/w80/pk.png',
    'fa': 'https://flagcdn.com/w80/ir.png',
    'ku': 'https://flagcdn.com/w80/iq.png',
    'am': 'https://flagcdn.com/w80/et.png',
    'sw': 'https://flagcdn.com/w80/tz.png',
    'zu': 'https://flagcdn.com/w80/za.png',
    'af': 'https://flagcdn.com/w80/za.png',
    'is': 'https://flagcdn.com/w80/is.png',
    'mt': 'https://flagcdn.com/w80/mt.png',
    'ga': 'https://flagcdn.com/w80/ie.png',
    'cy': 'https://flagcdn.com/w80/gb.png',
    'eu': 'https://flagcdn.com/w80/es.png',
    'ca': 'https://flagcdn.com/w80/es.png',
    'gl': 'https://flagcdn.com/w80/es.png',
    'sq': 'https://flagcdn.com/w80/al.png',
    'mk': 'https://flagcdn.com/w80/mk.png',
    'bs': 'https://flagcdn.com/w80/ba.png',
    'me': 'https://flagcdn.com/w80/me.png',
    'ka': 'https://flagcdn.com/w80/ge.png',
    'hy': 'https://flagcdn.com/w80/am.png',
    'az': 'https://flagcdn.com/w80/az.png',
    'kk': 'https://flagcdn.com/w80/kz.png',
    'ky': 'https://flagcdn.com/w80/kg.png',
    'uz': 'https://flagcdn.com/w80/uz.png',
  };

  const flagUrl = flagImages[countryCode] || 'https://flagcdn.com/w80/un.png';

  return (
    <div className={`flag-container ${className}`}>
      <div className="flag-pole"></div>
      <div className="flag-wrapper">
        <img 
          src={flagUrl} 
          alt={`${countryCode} flag`}
          className="flag-image"
          onError={(e) => {
            // Fallback to a generic flag if image fails to load
            e.target.src = 'https://flagcdn.com/w80/un.png';
          }}
        />
      </div>
    </div>
  );
};

export default FlagDisplay; 