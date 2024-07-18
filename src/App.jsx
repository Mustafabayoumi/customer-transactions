
import React from 'react';
import ClientsTable from './ClientsTable';
import AllClientsTransactionGraph  from './AllClientsTransactionGraph ';
import CustomerTransactionGraph  from './CustomerTransactionGraph ';

const App = () => {
  return (<React.Fragment>
    <div className="bg-white m-auto container">
      <ClientsTable />
      <div className="flex items-center flex-wrap p-5">
        <div className="lg:w-1/2 w-full m-auto">
          <CustomerTransactionGraph  />
        </div>
        <div className="lg:w-1/2 w-full m-auto">
          <AllClientsTransactionGraph  />
        </div>
      </div>
    </div>
  </React.Fragment>

  );
};

export default App;
