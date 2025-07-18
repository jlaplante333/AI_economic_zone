import React from 'react';

const CountryIcon = ({ countryCode, className = '' }) => {
  // Iconic country images mapping - using free, iconic photos with larger size
  const countryIcons = {
    'en': 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=240&h=240&fit=crop&crop=center', // Statue of Liberty
    'es': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=240&h=240&fit=crop&crop=center', // Sagrada Familia
    'zh': 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=240&h=240&fit=crop&crop=center', // Great Wall of China
    'vi': 'https://images.unsplash.com/photo-1643029891412-92f9a81a8c16?q=80&w=3572&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Vietnam
    'tl': 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=240&h=240&fit=crop&crop=center', // Manila, Philippines
    'ar': 'https://images.unsplash.com/photo-1633546707050-88e2b545831c?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Saudi Arabia
    'ko': 'https://images.unsplash.com/photo-1678649653438-3b0d6f793f23?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Korea
    'hi': 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=240&h=240&fit=crop&crop=center', // Taj Mahal
    'th': 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=240&h=240&fit=crop&crop=center', // Wat Phra Kaew
    'ja': 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2384&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Japan
    'ru': 'https://images.unsplash.com/photo-1554844344-c34ea04258c4?q=80&w=927&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Russia
    'fr': 'https://images.unsplash.com/photo-1568402028652-297e5f6fd07d?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // France
    'pt': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=240&h=240&fit=crop&crop=center', // Belem Tower
    'de': 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=240&h=240&fit=crop&crop=center', // Brandenburg Gate
    'it': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=240&h=240&fit=crop&crop=center', // Colosseum
    'tr': 'https://images.unsplash.com/photo-1564407727371-3eece6c58961?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Bosphorus Bridge and Buyuk Mecidiye Mosque, Istanbul
    'nl': 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?w=240&h=240&fit=crop&crop=center', // Windmills
    'sv': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Stockholm
    'no': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=240&h=240&fit=crop&crop=center', // Fjords
    'da': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Copenhagen
    'fi': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Helsinki
    'pl': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Warsaw
    'cs': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Prague
    'sk': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Bratislava
    'hu': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Budapest
    'ro': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Bucharest
    'bg': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Sofia
    'hr': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Zagreb
    'sr': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Belgrade
    'sl': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Ljubljana
    'et': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Tallinn
    'lv': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Riga
    'lt': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Vilnius
    'el': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Athens
    'he': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Jerusalem
    'id': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Jakarta
    'ms': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Kuala Lumpur
    'bn': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Dhaka
    'ur': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Islamabad
    'fa': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Tehran
    'ku': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Baghdad
    'am': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Addis Ababa
    'sw': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Dar es Salaam
    'zu': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Johannesburg
    'af': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Cape Town
    'is': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Reykjavik
    'mt': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Valletta
    'ga': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Dublin
    'cy': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Cardiff
    'eu': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Bilbao
    'ca': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Barcelona
    'gl': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Santiago
    'sq': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Tirana
    'mk': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Skopje
    'bs': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Sarajevo
    'me': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Podgorica
    'ka': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Tbilisi
    'hy': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Yerevan
    'az': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Baku
    'kk': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Astana
    'ky': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Bishkek
    'uz': 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center', // Tashkent
  };

  const iconUrl = countryIcons[countryCode] || 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center';

  return (
    <div className={`country-icon-container ${className}`}>
      <div className="icon-circle">
        <img 
          src={iconUrl} 
          alt={`${countryCode} icon`}
          className="country-icon-image"
          onError={(e) => {
            // Fallback to a generic world icon if image fails to load
            e.target.src = 'https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?w=240&h=240&fit=crop&crop=center';
          }}
        />
      </div>
    </div>
  );
};

export default CountryIcon; 