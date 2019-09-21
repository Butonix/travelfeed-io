import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';
import TeamMember from './TeamMember';

const Team = () => {
  const founders = [
    {
      name: 'Julian Peters',
      username: 'jpphotography',
      photo:
        'https://cdn.steemitimages.com/DQmZvY5pAzUa9qdwfErTDF24bUvEi3d8bzsRXCDcXZVhy2j/tf-profile%20copy.jpg',
      content: 'Lead Developer and Business Development Manager',
    },
    {
      name: 'Jürgen Horn',
      username: 'for91days',
      photo:
        'https://cdn.steemitimages.com/DQmRypQ18Qx3jLqkKcePHQBwvQimasg7CfNXFdDusfMbSHr/01--TF-Portrait-DSC00898.jpg',
      content: 'Curation-Team Coordinator and Community Manager',
    },
  ];
  const curators = [
    {
      username: 'elsaenroute',
      photo:
        'https://cdn.steemitimages.com/DQmQDPQwx6M6rarxNtN5jnTja95PBt9Pzx6dbSrYPNhCxuX/IMG_20190322_230301_855.jpg',
      content: 'Curator',
    },
    {
      username: 'mrprofessor',
      photo: 'https://i.imgur.com/cYPGMum.jpg',
      content: 'Curator',
    },
    {
      username: 'smeralda',
      photo:
        'https://cdn.discordapp.com/attachments/509459924216971275/590709431881433098/Smeralda.jpg',
      content: 'Curator',
    },
    {
      username: 'worldcapture',
      photo:
        'https://cdn.steemitimages.com/DQmSm16YZEhpHFsLW8J9RRmAaL4mbW5S2amC1HhGo5xUtwc/Qd-H4Itg_400x400.jpg',
      content: 'Curator',
    },
  ];
  const moderators = [
    {
      username: 'livinguktaiwan',
      photo:
        'https://cdn.discordapp.com/attachments/404657786073382916/588225470991171594/PSX_20190530_172424.jpg',
      content: 'Discord Moderator',
    },
    {
      username: 'wanderlass',
      photo:
        'https://steemitimages.com/DQmYf417RRBvwmN9D6q1M4n3pTpsDs7Ac3wwyozjAwbQ79e/Wanderlass%20avatar.png',
      content: 'Discord Moderator',
    },
  ];
  const international = [
    {
      username: 'saunter',
      photo:
        'https://cdn.steemitimages.com/DQmQJhiw4GTLfvrmh4YdeXyxfsXgWLLKA7nW7hgm7rHv1Cs/163903_165953620115571_2481178_n.jpg',
      content: 'Founder and curator of TravelFeed in Polish',
    },
  ];
  return (
    <Fragment>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center pt-4">
            <Typography variant="h4">Founders</Typography>
          </div>
          {founders.map(member => {
            return (
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <TeamMember
                  name={member.name}
                  username={member.username}
                  photo={member.photo}
                  content={member.content}
                />
              </div>
            );
          })}
          <div className="col-12 text-center pt-4">
            <Typography variant="h4">Curators</Typography>
          </div>
          {curators.map(member => {
            return (
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <TeamMember
                  name={member.name}
                  username={member.username}
                  photo={member.photo}
                  content={member.content}
                />
              </div>
            );
          })}
          <div className="col-12 text-center pt-4">
            <Typography variant="h4">Moderators</Typography>
          </div>
          {moderators.map(member => {
            return (
              <div className="col-xl-4 col-lg-4 col-md-6 col-12">
                <TeamMember
                  name={member.name}
                  username={member.username}
                  photo={member.photo}
                  content={member.content}
                />
              </div>
            );
          })}
          {
            //   <div className="col-12 text-center pt-4">
            //     <Typography variant="h4">International</Typography>
            //   </div>
            //   {international.map(member => {
            //     return (
            //       <div className="col-xl-4 col-lg-4 col-md-6 col-12">
            //         <TeamMember
            //           name={member.name}
            //           username={member.username}
            //           photo={member.photo}
            //           content={member.content}
            //         />
            //       </div>
            //     );
            //   })}
          }
        </div>
      </div>
    </Fragment>
  );
};

export default Team;
