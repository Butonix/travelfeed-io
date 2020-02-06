import { getDataFromTree } from '@apollo/react-ssr';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import PhotoDetailHeader from '../../components/General/PhotoDetailHeader';
import PostGrid from '../../components/Grid/PostGrid';
import Header from '../../components/Header/Header';
import capitalize from '../../helpers/capitalize';
import withApollo from '../../lib/withApollo';

const TagPage = () => {
  const router = useRouter();
  const { tag } = router.query;

  return (
    <Fragment>
      <Header active="tag" />
      <PhotoDetailHeader tag={tag} query={{ tag }} title={capitalize(tag)} />
      <div className="pb-2">
        <div className="container" id="containerInvisibleOnMobile">
          <PostGrid
            active="topic"
            query={{
              tags: tag,
              orderby: 'curation_score DESC, total_votes',
              limit: 9,
            }}
            grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
            cardHeight={200}
            poststyle="grid"
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
    </Fragment>
  );
};

export default withApollo(TagPage, { getDataFromTree });
