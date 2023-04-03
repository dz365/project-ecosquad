import PageLayout from "./PageLayout";

const CreditsPage = () => {
  return (
    <PageLayout showAvatar={false}>
      <div className="w-full h-screen bg-blue-gray flex flex-col gap-10 items-center justify-center">
        <p>
          Thank you to{" "}
          <a href="https://www.flaticon.com/" className="text-blue-600">
            flaticon
          </a>{" "}
          and
          <a href="https://fontawesome.com/" className="text-blue-600">
            {" "}
            Font Awesome
          </a>{" "}
          for the amazing images and icons.
        </p>
        <p>
          <a
            href="https://maplibre.org/maplibre-gl-js-docs/api/"
            className="text-blue-600"
          >
            Maplibre
          </a>{" "}
          for documention on how to use MapLibre GL JS{" "}
        </p>
        <p>
          <a href="https://docs.meilisearch.com/" className="text-blue-600">
            Meilisearch
          </a>{" "}
          for documention on how to use their search engine
        </p>
      </div>
    </PageLayout>
  );
};

export default CreditsPage;
