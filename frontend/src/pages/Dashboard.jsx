import ExpenseSummary from "../components/ExpenseSummary"

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="pt-20 md:ml-64 p-8">
        <ExpenseSummary />
      </div>
    </div>
  );
}


export default Dashboard;
