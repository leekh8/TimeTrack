import React from "react";
import { Helmet } from "react-helmet-async";

// 기준 도메인 — canonical·hreflang·구조화 데이터가 공유
const ORIGIN = "https://time-track-psi.vercel.app";

const SEO = ({ title, description, lang = "ko", keywords = [], image, url }) => {
  const base = url || `${ORIGIN}/`;
  // 언어별 자기참조 canonical (중복 URL 정규화)
  const canonical = `${base}?lng=${lang}`;

  // 검색 리치 결과용 WebApplication 구조화 데이터
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url: base,
    image,
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Any (web browser)",
    browserRequirements: "Requires JavaScript",
    inLanguage: lang,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(", ")} />

      {/* 언어별 자기참조 정규 URL (hreflang은 index.html 정적 관리 — 체계 통일) */}
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={base} />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* 구조화 데이터 (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
