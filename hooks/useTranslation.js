import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    t,
    i18n,
    // Helper function for common translations
    tCommon: (key) => t(`common.${key}`),
    tAuth: (key) => t(`auth.${key}`),
    tHome: (key) => t(`home.${key}`),
    tSettings: (key) => t(`settings.${key}`),
    tRequest: (key) => t(`request.${key}`),
    tProfile: (key) => t(`profile.${key}`),
    tNavigation: (key) => t(`navigation.${key}`),
    tLanguages: (key) => t(`languages.${key}`),
    tRequestUser: (key) => t(`requestUser.${key}`),
    tOffers: (key) => t(`offers.${key}`),
    tPosts: (key) => t(`posts.${key}`),
    tProviders: (key) => t(`providers.${key}`),
    tRequests: (key) => t(`requests.${key}`),
    tCategories: (key) => t(`categories.${key}`),
    tModal: (key) => t(`modal.${key}`),
    tTagModal: (key) => t(`tagModal.${key}`),
    tTags: (key) => t(`tags.${key}`),
    tBudget: (key) => t(`budget.${key}`),
    tLocation: (key) => t(`location.${key}`),
    tRequestDetails: (key) => t(`requestDetails.${key}`),
    tReview: (key) => t(`appReview.${key}`),
    tAboutUs: (key) => t(`aboutUs.${key}`),
    tSearch: (key) => t(`search.${key}`),
    tGroupWork: (key) => t(`groupWork.${key}`),
    tUI: (key) => t(`ui.${key}`),
    tWorkCards: (key) => t(`workCards.${key}`),
    tErrors: (key) => t(`errors.${key}`),
    tSignup: (key) => t(`auth.signupForm.${key}`),
    tCategoryDetails: (key) => t(`categoryDetails.${key}`),
    tDiscover: (key) => t(`discover.${key}`),
    tEditRequest: (key) => t(`editRequest.${key}`),
    tMakeOffer: (key) => t(`makeOffer.${key}`),
    tOfferMadeDetails: (key) => t(`offerMadeDetails.${key}`),
    tOffersMade: (key) => t(`offersMade.${key}`),
    tOfferUser: (key) => t(`offerUser.${key}`),
    tAddPost: (key) => t(`addPost.${key}`),
    tAddReel: (key) => t(`addReel.${key}`),
    tReelScreen: (key, options) => t(`reelScreen.${key}`, options),
    tRequestCreation: (key) => t(`requestCreation.${key}`),
    tWorkUser: (key) => t(`workUser.${key}`),
    tTabs: (key) => t(`tabs.${key}`),
    tReviewScreen: (key) => t(`review.${key}`),
    tScreenTitles: (key) => t(`screenTitles.${key}`),
    tToggles: (key) => t(`toggles.${key}`),
  };
};

export default useTranslation;
