import PageLayout from "./PageLayout";

const UnauthorizedPage = () => {
  return (
    <PageLayout showAvatar={false}>
      <div className="w-full h-screen bg-blue-gray flex flex-col gap-10 items-center justify-center">
        <div className="w-64 h-64 bg-white rounded-full">
          <div className="w-64 h-64 bg-plant bg-contain"></div>
        </div>
        <div className="text-center">
          <h1 className="text-green-700 text-2xl">Uh oh!</h1>
          <h1 className="text-gray-400 text-xl">
            You are unauthorized to access this page.
          </h1>
        </div>
      </div>
    </PageLayout>
  );
};

export default UnauthorizedPage;
