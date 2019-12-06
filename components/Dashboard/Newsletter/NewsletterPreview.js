// FIXME: Handle invalid inputs (e.g. invalid html in intro)

import Handlebars from 'handlebars';
import parse from 'html-react-parser';

const NewsletterPreview = props => {
  const { title, intro, updates, posts } = props;

  const source = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1" /><!--[if !mso]><!-->
        <meta http-equiv="X-UA-Compatible" content="IE=Edge" /><!--<![endif]-->
        <!--[if (gte mso 9)|(IE)]>
        <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
        </xml>
        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
        <style type="text/css">
          body {width: 600px;margin: 0 auto;}
          table {border-collapse: collapse;}
          table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
          img {-ms-interpolation-mode: bicubic;}
        </style>
        <![endif]-->
    
        <style type="text/css">
          body, p, div {
            font-family: arial;
            font-size: 15px;
            font-family: Roboto,Arial,'Helvetica Neue',Helvetica,sans-serif;
          }
          body {
            color: #000000;
          }
          body a {
            color: #1188E6;
            text-decoration: none;
          }
          p { margin: 0; padding: 0; }
          table.wrapper {
            width:100% !important;
            table-layout: fixed;
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          img.max-width {
            max-width: 100% !important;
          }
          .column.of-2 {
            width: 50%;
          }
          .column.of-3 {
            width: 33.333%;
          }
          .column.of-4 {
            width: 25%;
          }
          @media screen and (max-width:480px) {
            .preheader .rightColumnContent,
            .footer .rightColumnContent {
                text-align: left !important;
            }
            .preheader .rightColumnContent div,
            .preheader .rightColumnContent span,
            .footer .rightColumnContent div,
            .footer .rightColumnContent span {
              text-align: left !important;
            }
            .preheader .rightColumnContent,
            .preheader .leftColumnContent {
              font-size: 80% !important;
              padding: 5px 0;
            }
            table.wrapper-mobile {
              width: 100% !important;
              table-layout: fixed;
            }
            img.max-width {
              height: auto !important;
              max-width: 480px !important;
            }
            a.bulletproof-button {
              display: block !important;
              width: auto !important;
              font-size: 80%;
              padding-left: 0 !important;
              padding-right: 0 !important;
            }
            .columns {
              width: 100% !important;
            }
            .column {
              display: block !important;
              width: 100% !important;
              padding-left: 0 !important;
              padding-right: 0 !important;
              margin-left: 0 !important;
              margin-right: 0 !important;
            }
            .total_spacer {
              padding:0px 0px 0px 0px;
            }
          }
        </style>
        <!--user entered Head Start-->
        
         <!--End Head user entered-->
      </head>
      <body>
        <center class="wrapper" data-link-color="#1188E6" data-body-style="font-size: 14px; font-family: arial; color: #000000; background-color: #ebebeb;">
          <div class="webkit">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#ebebeb">
              <tr>
                <td valign="top" bgcolor="#ebebeb" width="100%">
                  <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="100%">
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td>
                              <!--[if mso]>
                              <center>
                              <table><tr><td width="600">
                              <![endif]-->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width:600px;" align="center">
                                <tr>
                                  <td role="modules-container" style="padding: 0px 0px 0px 0px; color: #000000; text-align: left;" bgcolor="#ffffff" width="100%" align="left">
                                    
        <table class="module preheader preheader-hide" role="module" data-type="preheader" border="0" cellpadding="0" cellspacing="0" width="100%"
               style="display: none !important; mso-hide: all; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
          <tr>
            <td role="module-content">
              <p></p>
            </td>
          </tr>
        </table>
            
        <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
              <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" src="https://cdn.steemitimages.com/DQmRR6Qy5kmF7P8wxaHWin3CiMuo7HZKzAJz5i4yC2DrQWQ/tfemailheader.png" alt="" width="600">
            </td>
          </tr>
        </table>
    
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding:35px 20px 0px 20px;line-height:30px;text-align:center;"
                height="100%"
                valign="top"
                bgcolor="">
                <h2><span style="color:#333333;">{{title}}</span></h2>
    
            </td>
          </tr>
          <tr>
            <td style="padding:10px 20px 20px 20px;line-height:25px;"><p>{{{intro}}}</p></td></tr>
        </table>
        
            <table class="module"
               role="module"
               data-type="divider"
               border="0"
               cellpadding="0"
               cellspacing="0"
               width="100%"
               style="table-layout: fixed;">
          <tr>
            <td style="padding:0px 0px 0px 0px;"
                role="module-content"
                height="100%"
                valign="top"
                bgcolor="">
              <table border="0"
                     cellpadding="0"
                     cellspacing="0"
                     align="center"
                     width="100%"
                     height="5px"
                     style="line-height:5px; font-size:5px;">
                <tr>
                  <td
                    style="padding: 0px 0px 5px 0px;"
                    bgcolor="#ebebeb"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
    
    {{#each updates}}
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding:25px 20px 0px 20px;line-height:30px;text-align:inherit;text-align:center;"
                height="100%"
                valign="top"
                bgcolor="">
                <h2><span style="color:#333333;">{{title}}</span></h2>
            </td>
          </tr>
        </table>
      
        <table  border="0"
                cellpadding="0"
                cellspacing="0"
                align="center"
                width="100%"
                role="module"
                data-type="columns"
                data-version="2"
                style="padding:0px 5px 0px 5px;"
                bgcolor="">
          <tr role='module-content'>
            <td height="100%" valign="top">
                <!--[if (gte mso 9)|(IE)]>
                  <center>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-spacing:0;border-collapse:collapse;table-layout: fixed;" >
                      <tr>
                <![endif]-->
              
        <!--[if (gte mso 9)|(IE)]>
          <td width="290.000px" valign="top" style="padding: 0px 0px 0px 0px;border-collapse: collapse;" >
        <![endif]-->
            {{#if image}}
        <table  width="290.000"
                style="width:290.000px;border-spacing:0;border-collapse:collapse;margin:0px 5px 0px 0px;"
                cellpadding="0"
                cellspacing="0"
                align="left"
                border="0"
                bgcolor=""
                class="column column-0 of-2
                      empty"
          >
          <tr>
            <td style="padding:0px;margin:0px;border-spacing:0;">
        <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="font-size:6px;line-height:10px;padding:0px 0px 0px 0px;" valign="top" align="center">
              <img class="max-width" border="0" style="display:block;color:#000000;text-decoration:none;font-family:Helvetica, arial, sans-serif;font-size:16px;max-width:100% !important;width:100%;height:auto !important;" src="https://steemitimages.com/293x0/{{image}}" alt="" width="292.5">
            </td>
          </tr>
        </table>
    
            </td>
          </tr>
        </table>
            {{/if}}
    
        <!--[if (gte mso 9)|(IE)]>
          </td>
        <![endif]-->
        <!--[if (gte mso 9)|(IE)]>
          <td width="290.000px" valign="top" style="padding: 0px 0px 0px 0px;border-collapse: collapse;" >
        <![endif]-->
    
        <table  
           {{#if image}}
        width="290.000"
                style="width:290.000px;border-spacing:0;border-collapse:collapse;margin:0px 0px 0px 5px;"
                class="column column-1 of-2
                      empty"
                        {{else}}
     style="padding:5px 15px 5px 15px;"
                       {{/if}}
                cellpadding="0"
                cellspacing="0"
                align="left"
                border="0"
                bgcolor=""
          >
          <tr>
            <td style="padding:0px;margin:0px;border-spacing:0;">
                
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding:0px 0px 0px 0px;line-height:22px;text-align:inherit;"
                height="100%"
                valign="top"
                bgcolor="">
                <div>{{{text}}}</div>
            </td>
          </tr>
        </table>
      
            </td>
          </tr>
        </table>
    
        <!--[if (gte mso 9)|(IE)]>
          </td>
        <![endif]-->
                <!--[if (gte mso 9)|(IE)]>
                      <tr>
                    </table>
                  </center>
                <![endif]-->
            </td>
          </tr>
        </table>
    
      <table border="0" cellPadding="0" cellSpacing="0" class="module" data-role="module-button" data-type="button" role="module" style="table-layout:fixed" width="100%"><tbody><tr><td align="center" class="outer-td" style="padding:10px 0px 15px 0px"><table border="0" cellPadding="0" cellSpacing="0" class="button-css__deep-table___2OZyb wrapper-mobile" style="text-align:center"><tbody><tr><td align="center" bgcolor="#ffffff" class="inner-td" style="border-radius:6px;font-size:16px;text-align:center;background-color:inherit">      {{#if button}}<a style="background-color:#00695C;border:1px solid #333333;border-color:#00695C;border-radius:3px;border-width:1px;color:#ffffff;display:inline-block;font-family:arial,helvetica,sans-serif;font-size:16px;font-weight:normal;letter-spacing:0px;line-height:16px;padding:15px 75px 15px 75px;text-align:center;text-decoration:none" href="{{link}}" target="_blank">{{button}}</a>    {{/if}}
    </td></tr></tbody></table></td></tr></tbody></table>
        <table class="module"
               role="module"
               data-type="divider"
               border="0"
               cellpadding="0"
               cellspacing="0"
               width="100%"
               style="table-layout: fixed;">
          <tr>
            <td style="padding:0px 0px 0px 0px;"
                role="module-content"
                height="100%"
                valign="top"
                bgcolor="">
              <table border="0"
                     cellpadding="0"
                     cellspacing="0"
                     align="center"
                     width="100%"
                     height="5px"
                     style="line-height:5px; font-size:5px;">
                <tr>
                  <td
                    style="padding: 0px 0px 5px 0px;"
                    bgcolor="#ebebeb"></td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
    {{/each}}
    
       <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
               <tr>
            <td style="padding:35px 20px 0px 20px;line-height:30px;text-align:center;"
                height="100%"
                valign="top"
                bgcolor="">
                <h2><span style="color:#333333;">Top posts from this week</span></h2>
    
            </td>
          </tr>
            {{#each posts}}
          <tr>
            <td style="padding:10px 20px 20px 20px;line-height:25px;">
          <h4 style="margin:0px 0px 10px 0px;"><a href="https://travelfeed.io/@{{author}}/{{permlink}}">{{title}}</a></h4>
          <p>{{excerpt}}</p>
          <p style="padding:5px 0px 0px 0px;"><span style="color:#cccccc;"><em>by <a href="https://travelfeed.io/@{{author}}">{{author}}</a></span></em></p>
    </td></tr>
    {{/each}}
        </table>
    
    
        <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding:30px 20px 0px 20px;line-height:22px;text-align:inherit;background-color:#F5F5F5;"
                height="100%"
                valign="top"
                bgcolor="#F5F5F5">
                <div style="text-align: center;"><span style="color:#7a7a7a;"><span style="font-size:11px;">TravelFeed - The Travel Community.</span></span></div>
            </td>
          </tr>
        </table>
      
        <table class="module" role="module" data-type="social" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tbody>
            <tr>
              <td valign="top" style="padding:10px 0px 30px 0px;font-size:6px;line-height:10px;background-color:#F5F5F5;">
                <table align="center">
                  <tbody>
                    <tr>
                      <td style="padding: 0px 5px;">
            <a role="social-icon-link"  href="https://www.facebook.com/travelfeedio" target="_blank" alt="Facebook"
              data-nolink="false"
              title="Facebook "
              style="-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;display:inline-block;background-color:#3B579D;">
              <img role="social-icon" alt="Facebook" title="Facebook "
                height="30"
                width="30"
                style="height: 30px, width: 30px"
                src="https://marketing-image-production.s3.amazonaws.com/social/white/facebook.png" />
            </a>
          </td>
                      <td style="padding: 0px 5px;">
            <a role="social-icon-link"  href="https://twitter.com/travelfeedio" target="_blank" alt="Twitter"
              data-nolink="false"
              title="Twitter "
              style="-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;display:inline-block;background-color:#7AC4F7;">
              <img role="social-icon" alt="Twitter" title="Twitter "
                height="30"
                width="30"
                style="height: 30px, width: 30px"
                src="https://marketing-image-production.s3.amazonaws.com/social/white/twitter.png" />
            </a>
          </td>
                      <td style="padding: 0px 5px;">
            <a role="social-icon-link"  href="https://www.instagram.com/travelfeed.io/" target="_blank" alt="Instagram"
              data-nolink="false"
              title="Instagram "
              style="-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px;display:inline-block;background-color:#7F4B30;">
              <img role="social-icon" alt="Instagram" title="Instagram "
                height="30"
                width="30"
                style="height: 30px, width: 30px"
                src="https://marketing-image-production.s3.amazonaws.com/social/white/instagram.png" />
            </a>
          </td>
                      
                    </tr>
                  </tbody>
                </table>
                
                    <table class="module" role="module" data-type="text" border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
          <tr>
            <td style="padding:30px 20px 0px 20px;line-height:22px;text-align:inherit;background-color:#F5F5F5;"
                height="100%"
                valign="top"
                bgcolor="#F5F5F5">
                <div style="text-align: center;"><span style="color:#7a7a7a;"><span style="font-size:11px;"> <p style="font-family:;font-size:11px;line-height:25px"><a class="Unsubscribe--unsubscribeLink" href="{{{unsubscribe}}}" style="color:#2277ee">Unsubscribe</a></p>
    </span></span></div>
            </td>
          </tr>
        </table>
                
    
              </td>
            </tr>
          </tbody>
        </table>
    
    
    
                                  </td>
                                </tr>
                              </table>
                              <!--[if mso]>
                              </td></tr></table>
                              </center>
                              <![endif]-->
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </center>
      </body>
    </html>`;
  const template = Handlebars.compile(source);

  const data = {
    title,
    intro,
    updates,
    posts,
  };
  if (props.loading) data.posts = [];
  const result = template(data);
  return parse(result, {});
};

export default NewsletterPreview;
