/* eslint-disable prefer-destructuring */
import parse from 'html-react-parser';
import React, { useEffect, useState } from 'react';
import getSlug from 'speakingurl';

require('./TableOfContents.css');

const TableOfContents = props => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const { htmlBody } = props;

    let lastHeadingLevel;
    let lastIsSubheading = false;
    const newHeadings = [];
    let hash1 = false;

    const parseOptions = {
      replace: ({ name, children, attribs }) => {
        if (!attribs) return;

        if (
          (name === 'h1' ||
            name === 'h2' ||
            name === 'h3' ||
            (!hash1 && name === 'h4')) &&
          children &&
          children.length > 0 &&
          children[0].data &&
          typeof children[0].data === 'string' &&
          name[1]
        ) {
          if (name === 'h1') hash1 = true;
          const level = Number(name[1]);
          const newHeading = {
            title: children[0].data,
            subheadings: [],
          };
          if (
            lastHeadingLevel &&
            (level === lastHeadingLevel + 1 ||
              (lastIsSubheading && level === lastHeadingLevel))
          ) {
            if (!lastIsSubheading || level === lastHeadingLevel)
              newHeadings[newHeadings.length - 1].subheadings.push(newHeading);
            else {
              const subheads = newHeadings[newHeadings.length - 1].subheadings;
              subheads[subheads.length - 1].subheadings.push(newHeading);
            }
            lastIsSubheading = true;
          } else {
            newHeadings.push(newHeading);
            lastIsSubheading = false;
          }
          lastHeadingLevel = level;
        }
      },
    };

    parse(htmlBody, parseOptions);
    setHeadings(newHeadings);
  }, [props]);

  return (
    <>
      <div className="toc">
        <div className="toc-header">Table of Contents</div>
        <ul className="toc-list">
          {headings.map(heading => {
            return (
              <li>
                <a href={`#${getSlug(heading.title)}`}>
                  <span className="toc-text">{heading.title}</span>
                </a>
                {heading.subheadings.length > 0 && (
                  <ul className="toc-list-l2">
                    {heading.subheadings.map(subheading => {
                      return (
                        <li>
                          <a href={`#${getSlug(subheading.title)}`}>
                            <span className="toc-text">{subheading.title}</span>
                          </a>
                          {subheading.subheadings.length > 0 && (
                            <ul className="toc-list-l3">
                              {subheading.subheadings.map(sh => {
                                return (
                                  <li>
                                    <a href={`#${getSlug(sh.title)}`}>
                                      <span className="toc-text">
                                        {sh.title}
                                      </span>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default TableOfContents;
