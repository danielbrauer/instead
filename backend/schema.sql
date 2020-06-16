--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: follow_requests; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.follow_requests (
    requester_id integer NOT NULL,
    requestee_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.follow_requests OWNER TO danielbrauer;

--
-- Name: followers; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.followers (
    follower_id integer NOT NULL,
    followee_id integer NOT NULL
);


ALTER TABLE public.followers OWNER TO danielbrauer;

--
-- Name: key_id_sequence; Type: SEQUENCE; Schema: public; Owner: danielbrauer
--

CREATE SEQUENCE public.key_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.key_id_sequence OWNER TO danielbrauer;

--
-- Name: key_set_id_seq; Type: SEQUENCE; Schema: public; Owner: danielbrauer
--

CREATE SEQUENCE public.key_set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.key_set_id_seq OWNER TO danielbrauer;

--
-- Name: key_sets; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.key_sets (
    id integer DEFAULT nextval('public.key_set_id_seq'::regclass) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.key_sets OWNER TO danielbrauer;

--
-- Name: keys; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.keys (
    key_set_id integer NOT NULL,
    user_id integer NOT NULL,
    wrapped_key jsonb NOT NULL
);


ALTER TABLE public.keys OWNER TO danielbrauer;

--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: danielbrauer
--

CREATE SEQUENCE public.post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.post_id_seq OWNER TO danielbrauer;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.posts (
    id integer DEFAULT nextval('public.post_id_seq'::regclass) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    iv text NOT NULL,
    author_id integer NOT NULL,
    filename text NOT NULL,
    key_set_id integer NOT NULL
);


ALTER TABLE public.posts OWNER TO danielbrauer;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: danielbrauer
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO danielbrauer;

--
-- Name: users; Type: TABLE; Schema: public; Owner: danielbrauer
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
    username text NOT NULL,
    verifier text NOT NULL,
    srp_salt text NOT NULL,
    display_name text NOT NULL,
    muk_salt text NOT NULL,
    private_key_iv text NOT NULL,
    private_key text NOT NULL,
    public_key jsonb NOT NULL
);


ALTER TABLE public.users OWNER TO danielbrauer;

--
-- Data for Name: follow_requests; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.follow_requests (requester_id, requestee_id, "timestamp") FROM stdin;
\.


--
-- Data for Name: followers; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.followers (follower_id, followee_id) FROM stdin;
\.


--
-- Data for Name: key_sets; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.key_sets (id, "timestamp") FROM stdin;
\.


--
-- Data for Name: keys; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.keys (key_set_id, user_id, wrapped_key) FROM stdin;
\.


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.posts (id, "timestamp", iv, author_id, filename, key_set_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: danielbrauer
--

COPY public.users (id, username, verifier, srp_salt, display_name, muk_salt, private_key_iv, private_key, public_key) FROM stdin;
1	LudicrousGoshawk	8a4707ec74b7a4ee048023e650857a262f5b19318b12339ba59c78b834ccf42762bf8ca02037bf234b8d1db2c602c67c185304ae875071031e8597c5cb0e79e18db0db7ef7b555bdce54efb535aacfb285f1bc1dfbf89427a0cb1ce95d5848b368cdcfaa8662d823f24e8125af530aa0cad329b4e020880d6d62092320f39186a643cf3141cb3bf28d248d0cc012a2b16daea277cffea3a107a8a8fe94e600305ca753fc360bda1886d6a7cc79a1255a8c850d29e0a0f7b8ed336e83af1d2f8d4bb13de4b371092a3c41b6bf098934964b09db9028110c2062cf901547e7f0208598b1d29d175b316609a8d04325233a8a3983bf86c3fcff4a8ca08ec3466bca	48704621e47ddcf62381e3c40d706d9e	Jeremy Irons	140a575dea24cde75bec6ee606811d57	ba9ae61fcea7c94aec38b2a8	0c4f777db73068d1257a260a2291748bdb4a5db4ef1d0293dbe099244360ff35737c2e075ae457afb1605c03f7e0f068130490d692b12b3babefd042d421b0872b6e1ab68e23063917b513c1d16c5ba5f9732581d8970efe4db04638897f4dc8edb98f9ec717efe45e7b9ded3697d50b503112006ca830d96a9eae0eaf2445433bb2d787f8425702f090e5a0990b2fbf9453a42a765e3659a87cb67ab8b246d92162aaafd4cb085694a56fd40351fae2b50cc59fd86b2a841ea24f32ac719e30da58acff3042ddbc6688fc8595914e29c0254ecf02ae1a6ef46d7f6d1e737b39c3ed962e7adcf99e2840b275bfaa5a557d1d30e3b142887e926fc150f9b986e44c725b7b9c759f297894be2ea344ecce34858af9a81493c1e18274fefabcde9b1ca6121ccb95aa89f9b053c425339815abad11cba6afb38025190d92486517c732af7284d167c4d6f8a22910273301690fb6bc24f9af2b7bc3b03fc9e51a73da8061ae151c815583987d2009f145414f650022c39dfc14dfff98e037da720a6365b3dc23586c029d6d20001162d8cea9f8c18f5ef54421bb68b55fde1213cd8d52dd1cfe444127e83bc8ba6647c4ecda75c64f19c90f4ef43b9f6155478d7848402d1b18acc6feaa2de4c022c2625e7d896b514a421b07afb712e451a65c5ddd4a31870a16e5ceb798de46fa3d602c7722520e4f44ddac5512581d505c4466978eed660e1c40f9489df9858e17a8f0e83c2609201c5d977b9ee946bd3582f261fa2abb0c31f601475fbf9d894b13e1da9acb5b507e18bea0a549827ae5a5f703cd4ef922e3106069f576308ce3edff0ee79f03c385db5dd047591553e42fddd6986de60280a02ed9b74c586ce291f15ec8c71a09ed806fb3c142907edbb601dd142dc168fc1c378d51bfdbbbd17ff2598ea0524d5a51f7af118f4af7e0d006982dabf03b3de038731f00b2881ed70ec0927b88efd91c9944b29ec4eff1b4f65a77cd370d748cc1d8326ebbe900179fe377783e52d2cc5330d8181ea984b50fb4f6c765099b567233d50ddd7fcd86ecd308910a8287d818efee52a7752c984bd72ec11c037c11b0fcd8e44056722d02ac3b0cf3e6df4efe9960adbbb282a4174e9fcfb032c084bc15822e9b00a5038282486e5a748b5e7c9a065062f8b07a7feeb5840741a93b77b9137bddaf263bb9bc6a5553c44b7b86687fb746601b400de663ebcb975ceabbc7f6ebb335c70ea405fbcfdae8318801d26acb41750a2aa6ab8817b7128ae6440fd72ba41e1d82956485a5c5914296ff34815a85420aee7395a4537c7e74e0c1edcb0ed7c1b0c5f7f66375a9a85fd6e5be209e9d262bb8741a05cde35e4e7f815df77d319c13f32861eb33fc01873e36c7bed43bfa6ed077b692a895ee8be931d63333f7a1945a096929ce516c77cee460b9653edf5443a8aa00cec7529d1a1ccaa58c5bd037a6ef09ddb5db71260cc8a225dbf857e0b11bbd1f943feb0263d65c0e27f5e0c5ba97bbeab540c5bda1cc416c52819945332be4f689bbeead930ef839c4a61675892349fac590380ff5fe1444806589fc76b9c18ac8dfc9b2a36b5f14000cb4c2d5e881188cd993676ce16fb025c8f3b167ddfe3e1de4635b61c8c09e983e1d836d27ae9b87047e8f97e6d321ed22a0c7c73031c4538bc527b0d5e62df26d7429be91a9cff2da1481275bcdfacb05f84a0f38a3a3e2333ccef849dd3e51af0d7972f4ea047f628779779d981a15839cb5f6fdfd62a71c8224f22c123d9873c9d2d98cbdf26460196d4dbd0ffde0598de112e1764a8e6872fe7ee6af40b2406080b101cbca32cdd92132a1722709301ae9a35e06d0b6da4915ddf5b869481b78bce1a85b36c1fab47c07e54da2a7d20ddbd6f0d093948b2172a0e6a0b0eeb9b9b81f55c21e1c422ff0130c5fc50c299c3e825bddea725e530f263399cb94bd72828458382626c6b8a568aa6244ed7395a04f243291e362f7b67af9490726d01f7b3af07e2e0869e0d8d9d02812973cc450e567f0ea5636ab4e70a707e5aac38b85d157e782aadcfa8fe3ad23b0c69b11aeb972de77fc91f9306ba8cb440520263121109037d13c42578d89a277abfcb832fc9f8094e61de72d957f17cd1053ebb4976e2adda482dfd2438296ed5d7a5edf08f089e193cc447970c046f4a0ec6c4239cc83846e56282387df955abc400e6470d0f4c5ca8a75e8fd32bb7b1cef522393ff6dfeb572e36f005966da6c04f83b9b6ffd5763a1089635aa577224e1bac59322d96b01a4d5e322f0be1f3fe631dff40a80839ee20bbd3f7f1f411d3b9433bdd08eca9807712cbdfb69ede7e423a753e612ad677a41f3b08155854c70e883e4125fd290b7694c02d26ee765b211a63658ff28ea853e2e00b59d69dcf6e9d10e64f84d13ff8146921d85823bc8ec26dc61226a464453bb4225e771c10f99e7113cab7a6aa5f0613cfb7fbb1a366d5a8221928f159f343dd0e929abf61ad2ba6ba3b18c749953c0cf275b2c429e02b67529771384954422e10742f402c4a5e4defcaa9841c5236927b198ad142b2bd8d543e2365175092c5e8dc403d37c33a2f9a80e0fcd43aca180a494b95e6431f0f335dabc4d4a234087fc4e2ad6490581fce30997cc92bbc0d3336625f04457ba541c5a0368568a17ed0cab0af211cc238704d4211fbc4ce04c13bf2bd7d500141326d50581e51e664300bcf993fe78e5ceab53b9a9ce04524dd72e9d918676542b36f24cc78997f5961528eee8c3f3b6cd0ab5792320eb6977e1e4b954146759793aa79af2727d2ca4c5ee1761e025e82ee61658ed1cb16ef6d3c605d567e237272a0f2f0e116d63851ce87ee8e08bc20e24f3d26bb35e7b8ceea460f76cbfcabaee90c1903bd3f85816c66225e9c155efea48b8bba3f969c4dbbb22056fd1226a1458e3c78d3a3740de0578905d78587750fffdd441aede6eb80075ca10c39e5811acca2689bfed8e18bc0297ffd64c1eb8b2f31e598d00e4f37978ca6e33693c34ff953faf95f1aaec00132113afae279b27b0d4c37add79b706de41c6c3d6230c9501ef930d106c17cffa0882170e378100b189eff0d42d5cb9ad966224c917598a678fd73a6659d999cee7c468f394ad48d596c6c776313ae50f5584ddedaa68e2cd3470de163c7d1a8b2a05fdc39737c53c171aa71b7fe75c8e9764ba3dc21f8d616f66deaae6b25c8540a57583b0f4eecbd213aead70b124dbf31f58f391992f87ed499846013acb1b5bf09e977f76328f50c0e3834519462597ac9339b3d9e2a7266ee770a428b9b9f17f7f37c76094280be2b80df65d217edcae0354d93df12f792b797e75957849c769221c4f220e744e9084d482fc7ed5f4e9fc5956f10a12719f98aabd9dadb8023cee47c9511490a87e389460eb124ee0fd1ee1c1a37120383dc7836f3a7e37c5a6f25cb44e937ea871d6d4392eae34b1415428600e86d4f8b695843ea3f44d98860dc686ff02480c7802a99198a2b96176d6f18dcce91c4dcd5c614bc160fb2982dc5417c9ff92f11717c6a0c278d7dcbeb8ef98d78bab09bea36a90b4fe0c96d58cd603a458d701365bc16b9ac2f0a2c576152be469b4e310531f94eaf693be4bdfce40e52d06ef3b455926d92da206f643b47b5844339b3d4848e4a06d7ba9d3734ed274104bc34d5acaaf202387a7d813be5f6c1bbb9387c6f7e60aad19738ea9a6626022827f5919614def1f75eb1f736f543c30c10d211897851025e9c62a6baf9b2c629cc64917135062cb746745ef0edb7d4dc7884d01066b5ca5935cfbae323405f7249008428c38ddfc1bdddb387a30c93ee0f770b135a8d183f427a8fb5c50a0c18f442b9fb5616ad26f8cf0b107e30e7f20bc99fd4eb83b86013b9fe1e093fcf82875f3e9797ef7d33510add457e90e1ffdcc0ceb43dc9770c3cb55f2e0469dff5cc883981fdee19506b4f4db9387da5b348ef7b8e8856c19f4d6d894ad82fc837f3f2e896e902f49c7e7bbb8699f0aefe689575d672b64b95f5fa2a9a305a82fbceaed0d6a36fce764e847ff698468ab9e074db8c417e1a63ee23360605a2098aac321492a984fc44772e1a3a31d78debc81ce5e9e1d38484d15ab1f2d060d9fa880cc6166b15a227ec4be74683f745fdc23f87b8221ac8e921f0b3aa04315bfa464eae206414c89441ba399ea4c63374caadf873aae149c1abae4cb81f374b5faeae4dbae265d97c9a1bcbcef22628fa6cf3f33a0d4b68a680bca3a723238af14f2bf5b539ff6730b881212bf2712c67944960a6c623b4e21b66a816f43c59a6ba474a8cbcb051a215bd91a6fab1d8efcbf085c17a2bec4a1820e82bccb290b3afd0eca2ae1fd21892bc09dfc8664877e1f3d6f84aef8246cf0ca240bb7111c941a222d526095c42c40dcd5b5f6e18d150d4156e2cd2b53fce6ca66f6400ab8241d53715ee8e5e6ba5fe1211ca49e090a713225a4f48c7a56bdfccf24d26a6cfa59deb12a174c28276ec95eb14ebb9528fa00c7591cf39557fa79bb82489c283e6e5934541e	{"e": "AQAB", "n": "pAHbCOVuevwt9aqBngiXnUyP2WYHK67WLLN2yFl4-GXzwpfgsN-MJFTH94u1a_0JGQLihsy8rDW2Nam9JPTgfEij8W6J_Q7wN_i-ruC2HhDzLp6yakX854b9ww3kmnEbx1bdU1HFHB2Y-GKHDAB1sqo6o2ot4TjGMh_zNCYaEwaPfHGo1ifW8kokpfqfqTSxrUKk4EN0vv8eRoq3L49q-XsIo57CUjrEk0VT9lV188OD730L4zUfGskuBBwfeaSAqASyWdaoiGG8l0zqp9mMSCWjbZRqXQLPMNyEjlMQnYq6v4qk-sQY0EN-dLjLgdC26j_s_S5gOAGumhHOjjgiNxPrxT8ShBe1qlcmtsPA2EL5lsXAd2SOJSeYBPVJ6G1FKv8XaKsCkuyjrHnEr8ccIVjy8C2CFU8c_kkNqOfVIa1sR_IrbZkxTgoW0DRTLl1JDOTDxZaW-Upl4WeFgHCHALfuayS5s9rFQvJK5X9WVo0UEuFZIyA5WurZPl_H3W9wX9bFSDBjaIhzXesgDwVpniJQ5pBzau36bcmTeo_BPdfG4pK8sFKu_SKbNsD9wn1dJ04uuw4kz9sZx8MyhtoM2oqEp88DgsEKvYNPjnq9O7dMlknq02rEI2Q1fmRoiTO6-rZFgn9hbzLW_0i1yDuaVfmg72bhPluSL6Tluhzk_hk", "alg": "RSA-OAEP-256", "ext": true, "kty": "RSA", "key_ops": ["encrypt"]}
\.


--
-- Name: key_id_sequence; Type: SEQUENCE SET; Schema: public; Owner: danielbrauer
--

SELECT pg_catalog.setval('public.key_id_sequence', 1, false);


--
-- Name: key_set_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danielbrauer
--

SELECT pg_catalog.setval('public.key_set_id_seq', 1, false);


--
-- Name: post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danielbrauer
--

SELECT pg_catalog.setval('public.post_id_seq', 3, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danielbrauer
--

SELECT pg_catalog.setval('public.user_id_seq', 1, true);


--
-- Name: key_sets key_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.key_sets
    ADD CONSTRAINT key_sets_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: follow_requests_idx; Type: INDEX; Schema: public; Owner: danielbrauer
--

CREATE INDEX follow_requests_idx ON public.follow_requests USING btree (requester_id, requestee_id);


--
-- Name: followers_idx; Type: INDEX; Schema: public; Owner: danielbrauer
--

CREATE INDEX followers_idx ON public.followers USING btree (follower_id, followee_id);


--
-- Name: keys_idx; Type: INDEX; Schema: public; Owner: danielbrauer
--

CREATE INDEX keys_idx ON public.keys USING btree (key_set_id, user_id);


--
-- Name: posts_timestamp; Type: INDEX; Schema: public; Owner: danielbrauer
--

CREATE INDEX posts_timestamp ON public.posts USING btree ("timestamp");


--
-- Name: users_username; Type: INDEX; Schema: public; Owner: danielbrauer
--

CREATE INDEX users_username ON public.users USING btree (username);


--
-- Name: follow_requests follow_requests_requestee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_requestee_id_fkey FOREIGN KEY (requestee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follow_requests follow_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: followers followers_followee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: followers followers_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keys keys_key_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT keys_key_set_id_fkey FOREIGN KEY (key_set_id) REFERENCES public.key_sets(id) ON DELETE CASCADE;


--
-- Name: keys keys_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT keys_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_key_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: danielbrauer
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_key_set_id_fkey FOREIGN KEY (key_set_id) REFERENCES public.key_sets(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM postgres;


--
-- PostgreSQL database dump complete
--

