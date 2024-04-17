import {
  document,
  images,
  musicalNotes,
  film,
  playOutline,
} from "ionicons/icons";

/*import {
  AdmobConsentStatus,
  AdMob,
  AdOptions,
  AdLoadInfo,
  InterstitialAdPluginEvents,
} from "@capacitor-community/admob";
*/

export const toCamelCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getIcon = (format: string) => {
  switch (format.toLowerCase()) {
    case "pdf":
      return document;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
      return images;
    case "mp4":
    case "avi":
    case "mkv":
      return film;
    case "mp3":
    case "wav":
    case "ogg":
      return musicalNotes;
    case "doc":
    case "docx":
    case "txt":
      return document;
    default:
      return playOutline; // Ícone genérico para outros formatos de arquivo de áudio/vídeo
  }
};

export async function initializeADS(): Promise<void> {
  /* await AdMob.initialize();

  const [trackingInfo, consentInfo] = await Promise.all([
    AdMob.trackingAuthorizationStatus(),
    AdMob.requestConsentInfo(),
  ]);

  if (trackingInfo.status === "notDetermined") {
    **
     * If you want to explain TrackingAuthorization before showing the iOS dialog,
     * you can show the modal here.
     * ex)
     * const modal = await this.modalCtrl.create({
     *   component: RequestTrackingPage,
     * });
     * await modal.present();
     * await modal.onDidDismiss();  // Wait for close modal
     **

    await AdMob.requestTrackingAuthorization();
  }

  const authorizationStatus = await AdMob.trackingAuthorizationStatus();
  if (
    authorizationStatus.status === "authorized" &&
    consentInfo.isConsentFormAvailable &&
    consentInfo.status === AdmobConsentStatus.REQUIRED
  ) {
    await AdMob.showConsentForm();
  }
}

export async function interstitial(): Promise<void> {
  AdMob.addListener(InterstitialAdPluginEvents.Loaded, (info: AdLoadInfo) => {
    // Subscribe prepared interstitial
  });

  const options: AdOptions = {
    adId: "YOUR ADID",
    // isTesting: true
    // npa: true
  };
  await AdMob.prepareInterstitial(options);
  await AdMob.showInterstitial();
  
  */
}
