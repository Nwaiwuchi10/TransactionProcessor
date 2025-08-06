import AdminDashboard from "./Dashboard";

import TransactionProcessor from "../components/ledgerUpload/UploadLedger";
// import PaginatedTransactions from "../components/FetchLedger/FetchLedger";

const DashboardBody = () => {
  return (
    <AdminDashboard>
      <div>
        <TransactionProcessor />
      </div>
      {/* <div style={{ marginTop: "60px" }}>
        <PaginatedTransactions />
      </div> */}
    </AdminDashboard>
  );
};

export default DashboardBody;
