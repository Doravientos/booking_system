import {
  Button, Empty, Pagination, Result, Skeleton, Tag
} from 'antd';
import React, { useEffect, useState } from 'react';
import { v4 as uniqueId } from 'uuid';
import useFetchData from '../../hooks/useFetchData';
import arrayToCommaSeparatedText from '../../utils/arrayToCommaSeparatedText';
import { bookingStatusAsResponse } from '../../utils/responseAsStatus';
import QueryOptions from '../shared/QueryOptions';

function Orders() {
  const [fetchAgain] = useState(false);
  const [query, setQuery] = useState({
    search: '', sort: 'desc', page: '1', rows: '10'
  });

  // fetch booking-list API data
  const [loading, error, response] = useFetchData(`/api/v1/get-all-booking-orders?keyword=${query.search}&limit=${query.rows}&page=${query.page}&sort=${query.sort}`, fetchAgain);

  // reset query options
  useEffect(() => {
    setQuery((prevState) => ({ ...prevState, page: '1' }));
  }, [query.rows, query.search]);

  return (
    <div>
      {/* booking list ― query section */}
      <QueryOptions query={query} setQuery={setQuery} disabledSearch />

      {/* room list ― content section */}
      <div className='w-full flex flex-row flex-wrap items-center justify-center gap-2'>
        {error ? (
          <Result
            title='Failed to fetch'
            subTitle={error}
            status='error'
          />
        ) : (
          <Skeleton loading={loading} paragraph={{ rows: 10 }} active>
            {response?.data?.rows?.length === 0 ? (
              <Empty
                className='mt-10'
                description={(<span>Sorry! Any data was not found.</span>)}
              />
            ) : (
              <div className='table-layout'>
                <div className='table-layout-container'>
                  <table className='data-table'>
                    {/* data table ― head */}
                    <thead className='data-table-head'>
                      <tr className='data-table-head-tr'>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Dates
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booking Status
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booked By
                        </th>
                        <th className='data-table-head-tr-th' scope='col'>
                          Booked Room
                        </th>
                        <th className='data-table-head-tr-th text-center' scope='col'>
                          Booking Actions
                        </th>
                      </tr>
                    </thead>

                    {/* data table ― body */}
                    <tbody>
                      {response?.data?.rows?.map((data) => (
                        <tr className='data-table-body-tr' key={uniqueId()}>
                          <td className='data-table-body-tr-td'>
                            {arrayToCommaSeparatedText(data?.booking_dates?.map(
                              (date) => (date.split('T')[0])
                            ))}
                          </td>
                          <td className='data-table-body-tr-td text-center'>
                            <Tag
                              className='w-[100px] text-center uppercase'
                              color={bookingStatusAsResponse(data?.booking_status).color}
                            >
                              {bookingStatusAsResponse(data?.booking_status).level}
                            </Tag>
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.booking_by?.fullName}
                          </td>
                          <td className='data-table-body-tr-td'>
                            {data?.room?.room_name}
                          </td>
                          <td className='data-table-body-tr-td !px-0 text-center'>
                            <Button
                              className='inline-flex items-center !px-2'
                              type='link'
                            >
                              Update Status
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Skeleton>
        )}
      </div>

      {/* booking list ― pagination */}
      {response?.data?.total_page > 1 && (
        <Pagination
          className='my-5'
          onChange={(e) => setQuery((prevState) => ({ ...prevState, page: e }))}
          total={response?.data?.total_page * 10}
          current={response?.data?.current_page}
        />
      )}
    </div>
  );
}

export default Orders;
