import { OctagonAlert } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: center;
`;

const ErrorDetailContainer = styled.div`
  border-radius: 4px;
  font-weight: bold;
  text-align: center;

  h2 {
    padding: 0px;
  }
`;

type ErrorDetailProps = {
  message: string;
};

export const ErrorDetail = memo((props: ErrorDetailProps) => {
  const { t } = useTranslation();

  return (
    <ErrorDetailContainer>
      <span>
        <OctagonAlert size={128} />
      </span>
      <h1>{t("error.title")}</h1>
      <p>{t("error.message")}</p>
      {props.message && <p>{props.message}</p>}
    </ErrorDetailContainer>
  );
});
