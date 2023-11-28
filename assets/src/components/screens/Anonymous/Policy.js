import React from "react";
import AnonymousHeader from "../../parts/AnonymousHeader";
import { findChildren, findParent } from "../../utils/DomElement";

export default function Policy() {

    const handleCollapseAccordeon = (e) => {
        let targetClassname = e.target.className
        let currentTarget = e.target

        if(targetClassname !== "-header") {
            currentTarget = findParent(e.target, "-header")
        }

        let accordeonParent = findParent(e.target, "accordeon")
        let accordeonContent = findChildren(accordeonParent, "-content")
        
        // Add/remove the classname "-collapse"
        if(accordeonContent.className.includes("-collapse")) {
            accordeonContent.classList.remove("-collapse")
        } else {
            accordeonContent.classList.add("-collapse")
        }
    }

    return (
        <AnonymousHeader>
            <div className={"page-wrapper"}>
                <div className={"page-section"}>
                    <h2 className={"page-title"}>Policy</h2>

                    <div className={"accordeon-list"}>
                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Data Collected</h3>
                            </div>
                            <div className={"-content -collapse"}>
                                <p>We collect information you provide directly to us. For example, we collect information when you create an account, subscribe, participate in any interactive features of our services, fill out a form, request customer support or otherwise communicate with us. The types of information we may collect include your firstname, your lastname, email address and identifying information you choose to provide.<br/><br/>
                                We also use various technologies to collect information, and this may include sending cookies to your computer. Cookies are small data files stored on your hard drive or in your device memory that helps us to improve our services and your experience, see which areas and count visits. We may also collect information using web beacons (also known as "tracking pixels"). Web beacons are electronic images that may be used in our services or emails and to track count visits or understand usage.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Use of the Data</h3>
                            </div>
                            <div className={"-content"}>
                                <p>We only use your personal information to provide you the WikiEarth services or to communicate with you about the Website or the services.<br/><br/>
                                We employ industry standard techniques to protect against unauthorized access of data about you that we store, including personal information.<br/><br/>
                                We do not share or sell personal information you have provided to third party.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Sharing of Data</h3>
                            </div>
                            <div className={"-content"}>
                                <p>We don't share or sell any of your personal data with third parties entities.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Security</h3>
                            </div>
                            <div className={"-content"}>
                                <p>We take reasonable steps to protect personally identifiable information from loss, misuse, and unauthorized access, disclosure, alteration, or destruction. But, you should keep in mind that no Internet transmission is ever completely secure or error-free. In particular, email sent to or from the sites may not be secure.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Changes to the Privacy Policy</h3>
                            </div>
                            <div className={"-content"}>
                                <p>We may amend this Privacy Policy from time to time. Use of information we collect now is subject to the Privacy Policy in effect at the time such information is used.<br/><br/>
                                If we make major changes in the way we collect or use information, we will notify you by posting an announcement on the Website or sending you an email.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"page-section"}>
                    <h2 className={"page-title"}>Terms & Condition</h2>

                    <div className={"accordeon-list"}>
                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Agreement to Terms</h3>
                            </div>
                            <div className={"-content"}>
                                <p>These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”) and WikiEarth (“we,” “us” or “our”), concerning your access and use of this website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the “site”). <br/><br/>
                                You agree that by accessing the site, you have read, understood, and agree to be bound by all of these Terms of Service. If you do not agree with all of these Terms of Service, then you are expressly prohibited from using the site and you must discontinue use immediately.<br/><br/>
                                Supplemental Terms of Service or documents that may be posted on the site from time to time are hereby expressly incorporated herein by reference. We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason.<br/><br/>
                                We will alert you about any changes by updating the “Last updated” date of these Terms of Service, and you waive any right to receive specific notice of each such change.<br/><br/>
                                It is your responsibility to periodically review these Terms of Service to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Service by your continued use of the site after the date such revised Terms of Service are posted.<br/><br/>
                                The information provided on the site is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country.<br/><br/>
                                Accordingly, those persons who choose to access the site from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Intellectual Property Rights</h3>
                            </div>
                            <div className={"-content"}>
                                <p>Unless otherwise indicated, the site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, foreign jurisdictions, and international conventions.<br/><br/>
                                The Content and the Marks are provided on the site “AS IS” for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.<br/><br/>
                                Provided that you are eligible to use the site, you are granted a limited license to access and use the site and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the site, the Content and the Marks.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>User Representations</h3>
                            </div>
                            <div className={"-content"}>
                                <p>By using the site, you represent and warrant that:</p>
                                <ul>
                                    <li>all registration information you submit will be true, accurate, current, and complete ;</li>
                                    <li>you will maintain the accuracy of such information and promptly update such registration information as necessary ;</li>
                                    <li>you have the legal capacity and you agree to comply with these Terms of Service ;</li>
                                    <li>you will not access the site through automated or non-human means, whether through a bot, script, or otherwise ;</li>
                                    <li>you will not use the site for any illegal or unauthorized purpose ;</li>
                                    <li>your use of the site will not violate any applicable law or regulation</li>
                                </ul>
                                <p>If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the site (or any portion thereof).</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>User Registration</h3>
                            </div>
                            <div className={"-content"}>
                                <p>You may be required to register with the site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.</p>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>Prohibited activities</h3>
                            </div>
                            <div className={"-content"}>
                                <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.<br /><br />
                                As a user of the Site, you agree not to :</p>
                                
                                <ul>
                                    <li>systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
                                    <li>make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
                                    <li>use the Site to advertise or offer to sell goods and services.</li>
                                    <li>circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</li>
                                    <li>engage in unauthorized framing of or linking to the Site.</li>
                                    <li>trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords</li>
                                    <li>make improper use of our support services or submit false reports of abuse or misconduct.</li>
                                    <li>engage in any automated use of the system, such as using scripts to send comments or messages, or using any data mining, robots, or similar data gathering and extraction tools.</li>
                                    <li>interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.</li>
                                    <li>attempt to impersonate another user or person or use the username of another user.</li>
                                    <li>sell or otherwise transfer your profile.</li>
                                    <li>use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
                                    <li>use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
                                    <li>decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Site.</li>
                                    <li>attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
                                    <li>harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Site to you.</li>
                                    <li>delete the copyright or other proprietary rights notice from any Content.</li>
                                    <li>copy or adapt the Site’s software, including but not limited to Flash, PHP, HTML, JavaScript, or other code.</li>
                                    <li>upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site;</li>
                                    <li>upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1&#10005;1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”).</li>
                                    <li>except as may be the result of standard search engine or Internet browser usage, use, launch, develop, or distribute any automated system, including without limitation, any spider, robot, cheat utility, scraper, or offline reader that accesses the Site, or using or launching any unauthorized script or other software.</li>
                                    <li>disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
                                    <li>use the Site in a manner inconsistent with any applicable laws or regulations.</li>
                                </ul>
                            </div>
                        </div>

                        <div className={"accordeon"}>
                            <div className={"-header"} onClick={(e) => handleCollapseAccordeon(e)}>
                                <h3 className={"-title"}>User Generated Contributions</h3>
                            </div>
                            <div className={"-content"}>
                                <p>The Site may invite you to chat, contribute to, or participate in blogs, message boards, online forums, and other functionality, and may provide you with the opportunity to create, submit, post, display, transmit, perform, publish, distribute, or broadcast content and materials to us or on the Site, including but not limited to text, writings, video, audio, photographs, graphics, comments, suggestions, or personal information or other material (collectively, "Contributions").<br /><br />
                                As such, any Contributions you transmit may be treated as non-confidential and non-proprietary. When you create or make available any Contributions, you thereby represent and warrant that :</p>
                                <ul>
                                    <li>you are the creator and owner of or have the necessary licenses, rights, consents, releases, and permissions to use and to authorize us, the Site, and other users of the Site to use your Contributions in any manner contemplated by the Site and these Terms of Service.</li>
                                    <li>you have the written consent, release, and/or permission of each and every identifiable individual person in your Contributions to use the name or likeness of each and every such identifiable individual person to enable inclusion and use of your Contributions in any manner contemplated by the Site and these Terms of Service.</li>
                                    <li>your Contributions are not false, inaccurate, or misleading.</li>
                                    <li>your Contributions are not obscene, lewd, lascivious, filthy, violent, harassing, libelous, slanderous, or otherwise objectionable (as determined by us).</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AnonymousHeader>
    )
}