"use client";

import { useEffect, useState } from "react";

// Replace these with your actual AppsFlyer OneLink URL and app store IDs
const ONELINK_URL = process.env.NEXT_PUBLIC_AF_ONELINK_URL ?? "https://yourbrand.onelink.me/XXXX";
const IOS_APP_ID = process.env.NEXT_PUBLIC_IOS_APP_ID ?? "id123456789";
const ANDROID_PKG = process.env.NEXT_PUBLIC_ANDROID_PKG ?? "com.yourapp.android";

declare global {
  interface Window {
    AF_SMART_SCRIPT?: {
      generateOneLinkURL: (params: {
        oneLinkURL: string;
        afParameters?: {
          mediaSource?: { keys: string[]; defaultValue: string };
          campaign?: { keys: string[]; defaultValue: string };
          channel?: { keys: string[]; defaultValue: string };
          afSub1?: { keys: string[]; defaultValue: string };
          afSub2?: { keys: string[]; defaultValue: string };
          afCustom?: { paramKey: string; keys: string[]; defaultValue: string }[];
        };
        androidParameters?: {
          packageName?: string;
          [key: string]: string | undefined;
        };
        iosParameters?: {
          appId?: string;
          [key: string]: string | undefined;
        };
      }) => { clickURL: string } | null;
      fireImpressionsLink: () => void;
    };
    gtag?: (...args: unknown[]) => void;
  }
}

export default function DownloadButtons() {
  const [appStoreUrl, setAppStoreUrl] = useState<string>(
    `https://apps.apple.com/app/${IOS_APP_ID}`
  );
  const [playStoreUrl, setPlayStoreUrl] = useState<string>(
    `https://play.google.com/store/apps/details?id=${ANDROID_PKG}`
  );

  useEffect(() => {
    const generateSmartLinks = () => {
      if (typeof window === "undefined" || !window.AF_SMART_SCRIPT) return;

      try {
        const result = window.AF_SMART_SCRIPT.generateOneLinkURL({
          oneLinkURL: ONELINK_URL,
          afParameters: {
            mediaSource: {
              keys: ["utm_source"],
              defaultValue: "direct",
            },
            campaign: {
              keys: ["utm_campaign"],
              defaultValue: "landing_page",
            },
            channel: {
              keys: ["utm_medium"],
              defaultValue: "web",
            },
            afSub1: {
              keys: ["utm_content"],
              defaultValue: "",
            },
            afSub2: {
              keys: ["utm_term"],
              defaultValue: "",
            },
          },
          androidParameters: {
            packageName: ANDROID_PKG,
          },
          iosParameters: {
            appId: IOS_APP_ID,
          },
        });

        if (result?.clickURL) {
          // Both buttons use the same smart link — AppsFlyer redirects per platform
          setAppStoreUrl(result.clickURL);
          setPlayStoreUrl(result.clickURL);
          // Fire impression tracking
          window.AF_SMART_SCRIPT?.fireImpressionsLink();
        }
      } catch (err) {
        console.error("AppsFlyer Smart Script error:", err);
      }
    };

    // The script may already be loaded or still loading.
    // 'af_smart_script_loaded' is the standard custom event dispatched by
    // the AppsFlyer Smart Script library once it has initialised.
    if (window.AF_SMART_SCRIPT) {
      generateSmartLinks();
    } else {
      const onLoad = () => generateSmartLinks();
      window.addEventListener("af_smart_script_loaded", onLoad);
      return () => window.removeEventListener("af_smart_script_loaded", onLoad);
    }
  }, []);

  const handleClick = (store: "ios" | "android") => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "store_button_click", {
        event_category: "engagement",
        event_label: store === "ios" ? "App Store" : "Play Store",
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
      {/* App Store Button */}
      <a
        href={appStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick("ios")}
        className="flex h-14 w-48 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white transition-transform hover:scale-105 active:scale-95"
        aria-label="Download on the App Store"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 shrink-0"
          aria-hidden="true"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-light">Download on the</span>
          <span className="text-base font-semibold">App Store</span>
        </div>
      </a>

      {/* Play Store Button */}
      <a
        href={playStoreUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => handleClick("android")}
        className="flex h-14 w-48 items-center justify-center gap-3 rounded-xl bg-black px-5 text-white transition-transform hover:scale-105 active:scale-95"
        aria-label="Get it on Google Play"
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 shrink-0"
          aria-hidden="true"
        >
          <path d="M3.18 23.76c.3.17.64.22.98.14l12.49-7.17-2.79-2.79L3.18 23.76zM.44 1.35C.17 1.64 0 2.08 0 2.68v18.64c0 .6.17 1.04.44 1.33l.07.07 10.44-10.44v-.25L.51 1.28l-.07.07zM20.67 10.3l-2.99-1.72-3.12 3.12 3.12 3.12 3-1.73c.86-.49.86-1.3 0-1.79zM3.18.24l10.68 6.13-2.79 2.79L3.18.38C2.88.21 2.56.16 2.22.24L3.18.24z" />
        </svg>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-xs font-light">Get it on</span>
          <span className="text-base font-semibold">Google Play</span>
        </div>
      </a>
    </div>
  );
}
