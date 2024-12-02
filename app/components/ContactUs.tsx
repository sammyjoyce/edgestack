import React from 'react';

function ContactUs() {
  return (
    <div className="sp" id="contact-us">
      <h2 className="title">Contact Us</h2>
      <h3 className="title2 my-10">WE ARE JUST A PHONE CALL AWAY!</h3>
      <h2 className="p">
        - Email: contact@lushconstructions.com || info@lushconstructions.com
      </h2>
      <p className="p">- Phone: 0404 289 437</p>
      <p className="p">- Address: PO BOX 821 Marrickville, NSW 2204</p>
      <p className="p mt-10">- ABN: 99 652 947 528</p>
      <p className="p">- ACN: 141 565 746</p>
      <p className="p">- License Number: TBD</p>
      <section className="text-white">
        <h2 className="title2 my-4 !text-xl">Follow</h2>
        <ul className="icons flex gap-3">
          <li className="border border-white rounded-sm">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.instagram.com/lushconstructions"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="40"
                width="40"
                viewBox="0 0 448 512"
                className="p-2"
              >
                <path
                  fill="#FFF"
                  d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                ></path>
              </svg>
            </a>
          </li>
        </ul>
      </section>
      <div className="md:flex gap-10 mt-10 items-end">
        <div className="md:w-1/2">
          <h3 className="title2">GET IN TOUCH</h3>
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            className="md:mt-28 mt-12"
          >
            <div>
              <input
                type="hidden"
                name="access_key"
                value="a99ac5a8-4ff7-4500-80ca-fc44b389460b"
              />
              <div className="flex gap-4 items-center">
                <input
                  className="placeholder:text-md placeholder:text-base py-2 text-white border-b-2 border-[#c9c9c9] focus:border-[#f2849e]"
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Name"
                />
                <input
                  className="placeholder:text-md placeholder:text-base py-2 border-b-2 text-white border-[#c9c9c9] focus:border-[#f2849e]"
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Email"
                />
              </div>
              <div className="mt-4">
                <textarea
                  className="placeholder:text-md placeholder:text-base py-2 border-b-2 text-white border-[#c9c9c9] focus:border-[#f2849e]"
                  name="message"
                  id="message"
                  placeholder="Message"
                  rows="4"
                ></textarea>
              </div>
            </div>
            <input type="submit" className="py-2 bg-white" value="Send" />
          </form>
        </div>
        <div className="md:w-1/2 md:mt-0 mt-10">
          <section>
            <div className="map-div">
              <iframe
                src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=PO%20BOX%20821%20Marrickville,%20NSW%202204+(lushconstructions)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                width="100%"
                height="350px"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-md"
                title="Lush Constructions Location"
              ></iframe>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
