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
-- Name: follow_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.follow_requests (
    requester_id integer NOT NULL,
    requestee_id integer NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: followers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.followers (
    follower_id integer NOT NULL,
    followee_id integer NOT NULL
);


--
-- Name: key_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.key_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: key_id_sequence; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.key_id_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: key_set_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.key_set_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: key_sets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.key_sets (
    id integer DEFAULT nextval('public.key_set_id_seq'::regclass) NOT NULL,
    valid_start timestamp without time zone DEFAULT now() NOT NULL,
    valid_end timestamp without time zone,
    owner_id integer NOT NULL
);


--
-- Name: keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keys (
    jwk text NOT NULL,
    user_id integer NOT NULL,
    key_set_id integer NOT NULL
);


--
-- Name: post_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id integer DEFAULT nextval('public.post_id_seq'::regclass) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT now() NOT NULL,
    author_id integer NOT NULL,
    filename text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    key_set_id integer NOT NULL,
    iv text NOT NULL
);


--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer DEFAULT nextval('public.user_id_seq'::regclass) NOT NULL,
    username text NOT NULL,
    verifier text NOT NULL,
    srp_salt text NOT NULL,
    display_name text NOT NULL,
    muk_salt text NOT NULL,
    private_key text NOT NULL,
    public_key jsonb NOT NULL,
    current_post_key_set integer,
    private_key_iv text NOT NULL
);


--
-- Name: follow_requests follow_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_pkey PRIMARY KEY (requester_id, requestee_id);


--
-- Name: followers followers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_pkey PRIMARY KEY (follower_id, followee_id);


--
-- Name: key_sets key_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_sets
    ADD CONSTRAINT key_sets_pkey PRIMARY KEY (id);


--
-- Name: keys keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT keys_pkey PRIMARY KEY (user_id, key_set_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: posts_timestamp; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX posts_timestamp ON public.posts USING btree ("timestamp");


--
-- Name: users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_username ON public.users USING btree (username);


--
-- Name: follow_requests follow_requests_requestee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_requestee_id_fkey FOREIGN KEY (requestee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: follow_requests follow_requests_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.follow_requests
    ADD CONSTRAINT follow_requests_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: followers followers_followee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: followers followers_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.followers
    ADD CONSTRAINT followers_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keys key_key_set_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT key_key_set_fkey FOREIGN KEY (key_set_id) REFERENCES public.key_sets(id) ON DELETE CASCADE;


--
-- Name: key_sets key_set_owner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_sets
    ADD CONSTRAINT key_set_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: keys key_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keys
    ADD CONSTRAINT key_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_key_set_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_key_set_id_fkey FOREIGN KEY (key_set_id) REFERENCES public.key_sets(id) ON DELETE CASCADE;


--
-- Name: users users_current_post_key_set_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_current_post_key_set_fkey FOREIGN KEY (current_post_key_set) REFERENCES public.key_sets(id);


--
-- PostgreSQL database dump complete
--

