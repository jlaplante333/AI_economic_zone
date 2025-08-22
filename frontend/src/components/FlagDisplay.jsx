import React from 'react';
import { getLanguageByCode } from '../language/languages';

const FlagDisplay = ({ countryCode, className = '' }) => {
  // Custom Vietnamese flag implementation - check this first
  if (countryCode === 'vi') {
    return (
      <div className={`flag-container ${className}`} data-country={countryCode}>
        <div className="flag-pole"></div>
        <div className="flag-wrapper">
          <div className="vietnamese-flag">
            <div className="vietnamese-stripe yellow"></div>
            <div className="vietnamese-stripe red"></div>
            <div className="vietnamese-stripe yellow"></div>
            <div className="vietnamese-stripe red"></div>
            <div className="vietnamese-stripe yellow"></div>
            <div className="vietnamese-stripe red"></div>
            <div className="vietnamese-stripe yellow"></div>
          </div>
        </div>
      </div>
    );
  }

  // Flag image mapping - using realistic flag PNGs with higher resolution
  const flagImages = {
    // Oakland-specific languages
    'en': 'https://flagcdn.com/w320/us.png',
    'vi': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Flag_of_South_Vietnam.svg/1200px-Flag_of_South_Vietnam.svg.png',
    'ar': 'https://flagcdn.com/w320/sa.png',
    'es': 'https://flagcdn.com/w320/mx.png',
      'zh-cn': 'https://flagcdn.com/w320/cn.png', // Mandarin - China
  'zh-hk': 'https://flagcdn.com/w320/hk.png', // Cantonese - Hong Kong
    'tl': 'https://flagcdn.com/w320/ph.png',
    'ko': 'https://flagcdn.com/w320/kr.png',
    'hi': 'https://flagcdn.com/w320/in.png',
    'th': 'https://flagcdn.com/w320/th.png',
    'ja': 'https://flagcdn.com/w320/jp.png',
    
    // New languages with flags
    'km': 'https://flagcdn.com/w320/kh.png', // Cambodia
    'lo': 'https://flagcdn.com/w320/la.png', // Laos
    'ti': 'https://flagcdn.com/w320/er.png', // Eritrea
    'prs': 'https://flagcdn.com/w320/af.png', // Afghanistan
    'mam': 'https://flagcdn.com/w320/gt.png', // Guatemala
    
    // Additional languages
    'tr': 'https://flagcdn.com/w320/tr.png',
    'ru': 'https://flagcdn.com/w320/ru.png',
    'fr': 'https://flagcdn.com/w320/fr.png',
    'pt': 'https://flagcdn.com/w320/pt.png',
    'de': 'https://flagcdn.com/w320/de.png',
    'it': 'https://flagcdn.com/w320/it.png',
    'nl': 'https://flagcdn.com/w320/se.png',
    'sv': 'https://flagcdn.com/w320/se.png',
    'no': 'https://flagcdn.com/w320/no.png',
    'da': 'https://flagcdn.com/w320/dk.png',
    'fi': 'https://flagcdn.com/w320/fi.png',
    'pl': 'https://flagcdn.com/w320/pl.png',
    'cs': 'https://flagcdn.com/w320/cz.png',
    'sk': 'https://flagcdn.com/w320/sk.png',
    'hu': 'https://flagcdn.com/w320/hu.png',
    'ro': 'https://flagcdn.com/w320/ro.png',
    'bg': 'https://flagcdn.com/w320/bg.png',
    'hr': 'https://flagcdn.com/w320/hr.png',
    'sr': 'https://flagcdn.com/w320/rs.png',
    'sl': 'https://flagcdn.com/w320/si.png',
    'et': 'https://flagcdn.com/w320/ee.png',
    'lv': 'https://flagcdn.com/w320/lv.png',
    'lt': 'https://flagcdn.com/w320/lt.png',
    'el': 'https://flagcdn.com/w320/gr.png',
    'he': 'https://flagcdn.com/w320/il.png',
    'id': 'https://flagcdn.com/w320/id.png',
    'ms': 'https://flagcdn.com/w320/my.png',
    'bn': 'https://flagcdn.com/w320/bd.png',
    'ur': 'https://flagcdn.com/w320/pk.png',
    'fa': 'https://flagcdn.com/w320/ir.png',
    'ku': 'https://flagcdn.com/w320/iq.png',
    'am': 'https://flagcdn.com/w320/et.png',
    'sw': 'https://flagcdn.com/w320/tz.png',
    'zu': 'https://flagcdn.com/w320/za.png',
    'af': 'https://flagcdn.com/w320/za.png',
    'is': 'https://flagcdn.com/w320/is.png',
    'mt': 'https://flagcdn.com/w320/mt.png',
    'ga': 'https://flagcdn.com/w320/ie.png',
    'cy': 'https://flagcdn.com/w320/gb.png',
    'eu': 'https://flagcdn.com/w320/es.png',
    'ca': 'https://flagcdn.com/w320/es.png',
    'gl': 'https://flagcdn.com/w320/es.png',
    'sq': 'https://flagcdn.com/w320/al.png',
    'mk': 'https://flagcdn.com/w320/mk.png',
    'bs': 'https://flagcdn.com/w320/ba.png',
    'me': 'https://flagcdn.com/w320/me.png',
    'ka': 'https://flagcdn.com/w320/ge.png',
    'hy': 'https://flagcdn.com/w320/am.png',
    'az': 'https://flagcdn.com/w320/az.png',
    'kk': 'https://flagcdn.com/w320/kz.png',
    'ky': 'https://flagcdn.com/w320/kg.png',
    'uz': 'https://flagcdn.com/w320/uz.png',
  };

  const flagUrl = flagImages[countryCode] || 'https://flagcdn.com/w320/un.png';
  
  // Debug logging for flag loading
  console.log(`Loading flag for ${countryCode}:`, flagUrl);

  return (
    <div className={`flag-container ${className}`} data-country={countryCode}>
      <div className="flag-pole"></div>
      <div className="flag-wrapper">
        <img 
          src={flagUrl} 
          alt={`${countryCode} flag`}
          className="flag-image"
          onError={(e) => {
            // Log the error for debugging
            console.warn(`Flag failed to load for ${countryCode}:`, flagUrl);
            // Don't fallback to generic flag - keep the original URL
            // e.target.src = 'https://flagcdn.com/w320/un.png';
          }}
        />
      </div>
    </div>
  );
};

export default FlagDisplay; 