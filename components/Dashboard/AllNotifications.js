import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, { useEffect, useState } from 'react';
import {
  getNotificationContent,
  getUserNotifications,
} from '../../helpers/notifications';
import { getUser } from '../../helpers/token';
import CustomSnackbar from './Notifications/CustomSnackbar';

const AllNotifications = props => {
  let { limit } = props;
  if (!limit) limit = 25;

  const [notifications, setNotifications] = useState(undefined);

  useEffect(() => {
    getUserNotifications(getUser()).then(res => {
      setNotifications(res);
    });
  }, []);

  return (
    <>
      {(notifications && notifications.length < 1 && (
        <Card className="mt-5 m-2 text-center">
          <CardContent>No notifications.</CardContent>
        </Card>
      )) ||
        (notifications &&
          notifications.length > 0 &&
          notifications.map((notification, i) => {
            if (i < limit) {
              const content = getNotificationContent(notification);
              if (content)
                return (
                  <div className="pt-3">
                    <CustomSnackbar variant="info" message={content.message} />
                  </div>
                );
            }
            return <></>;
          })) || (
          <div className="p-5 text-center">
            <CircularProgress />
          </div>
        )}
    </>
  );
};

export default AllNotifications;
