"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { QuivrLogo } from "@/lib/assets/QuivrLogo";
import { AddBrainModal } from "@/lib/components/AddBrainModal";
import { useBrainCreationContext } from "@/lib/components/AddBrainModal/brainCreation-provider";
import { OnboardingModal } from "@/lib/components/OnboardingModal/OnboardingModal";
import PageHeader from "@/lib/components/PageHeader/PageHeader";
import { UploadDocumentModal } from "@/lib/components/UploadDocumentModal/UploadDocumentModal";
import { MessageInfoBox } from "@/lib/components/ui/MessageInfoBox/MessageInfoBox";
import QuivrButton from "@/lib/components/ui/QuivrButton/QuivrButton";
import { SearchBar } from "@/lib/components/ui/SearchBar/SearchBar";
import { useSupabase } from "@/lib/context/SupabaseProvider";
import { useUserSettingsContext } from "@/lib/context/UserSettingsProvider/hooks/useUserSettingsContext";
import { useUserData } from "@/lib/hooks/useUserData";
import { redirectToLogin } from "@/lib/router/redirectToLogin";
import { ButtonType } from "@/lib/types/QuivrButton";

import styles from "./page.module.scss";

const Search = (): JSX.Element => {
  const [isUserDataFetched, setIsUserDataFetched] = useState(false);
  const pathname = usePathname();
  const { session } = useSupabase();
  const { isBrainCreationModalOpened, setIsBrainCreationModalOpened } =
    useBrainCreationContext();
  const { userIdentityData } = useUserData();
  const { isDarkMode } = useUserSettingsContext();

  useEffect(() => {
    if (userIdentityData) {
      setIsUserDataFetched(true);
    }
  }, [userIdentityData]);

  useEffect(() => {
    if (session === null) {
      redirectToLogin();
    }
  }, [pathname, session]);

  const buttons: ButtonType[] = [
    {
      label: "Create brain",
      color: "primary",
      onClick: () => {
        setIsBrainCreationModalOpened(true);
      },
      iconName: "brain",
    },
  ];

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.page_header}>
          <PageHeader iconName="home" label="Home" buttons={buttons} />
        </div>
        <div className={styles.search_page_container}>
          <div className={styles.main_wrapper}>
            <div className={styles.quivr_logo_wrapper}>
              <QuivrLogo size={80} color={isDarkMode ? "white" : "black"} />
              <div className={styles.quivr_text}>
                <span>Talk to </span>
                <span className={styles.quivr_text_primary}>Quivr</span>
              </div>
            </div>
            <div className={styles.search_bar_wrapper}>
              <SearchBar />
            </div>
          </div>
          <div className={styles.shortcuts_card_wrapper}>
            <div className={styles.shortcut_wrapper}>
              <span>Press</span>
              <span className={styles.shortcut}>@</span>
              <span>to select a brain</span>
            </div>
          </div>
        </div>
        <UploadDocumentModal />
        <AddBrainModal />
        <OnboardingModal />
      </div>
      {!isBrainCreationModalOpened &&
        !userIdentityData?.onboarded &&
        !!isUserDataFetched && (
          <div className={styles.onboarding_overlay}>
            <div className={styles.first_brain_button}>
              <MessageInfoBox type="tutorial">
                <span>
                  Press the following button to create your first brain
                </span>
              </MessageInfoBox>
              <QuivrButton
                iconName="brain"
                label="Create Brain"
                color="primary"
                onClick={() => {
                  setIsBrainCreationModalOpened(true);
                }}
              />
            </div>
          </div>
        )}
    </>
  );
};

export default Search;
