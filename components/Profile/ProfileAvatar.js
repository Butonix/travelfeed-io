import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import Img from 'react-image';
import Link from '../../lib/Link';

const ProfileAvatar = props => {
  const { author } = props;

  if (props.authorAvatar)
    return (
      <Img
        className="rounded-circle pr-0"
        src={[
          props.authorAvatar,
          `https://steemitimages.com/p/7ohP4GDMGPrVF5MeU8t5EQqCvJfGAJHyAFuxrYFhqA4BPKCkPjVBef1jSt7fHRrXVXRuRKBksi1FSJnZL8Co9zi6CpbK1bmV2sFR?width=40&height=40`,
        ]}
        alt={author}
        width={40}
        height={40}
        loader={<Skeleton variant="circle" width={40} height={40} />}
      />
    );

  return (
    <Link color="textPrimary" as={`/@${author}`} href="/[author]">
      <Img
        className="rounded-circle pr-0"
        style={{ cursor: 'pointer' }}
        src={[
          `https://steemitimages.com/u/${author}/avatar/small`,
          `https://steemitimages.com/p/7ohP4GDMGPrVF5MeU8t5EQqCvJfGAJHyAFuxrYFhqA4BPKCkPjVBef1jSt7fHRrXVXRuRKBksi1FSJnZL8Co9zi6CpbK1bmV2sFR?width=40&height=40`,
        ]}
        alt={author}
        width={40}
        height={40}
        loader={<Skeleton variant="circle" width={40} height={40} />}
      />
    </Link>
  );
};

export default ProfileAvatar;
