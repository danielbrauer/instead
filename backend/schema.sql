--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8 (Ubuntu 11.8-1.pgdg16.04+1)
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
    key jsonb NOT NULL,
    iv text NOT NULL,
    author_id integer NOT NULL,
    filename text NOT NULL
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
    private_key_iv text NOT NULL,
    private_key text NOT NULL,
    public_key jsonb NOT NULL
);


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
-- Name: follow_requests_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX follow_requests_idx ON public.follow_requests USING btree (requester_id, requestee_id);


--
-- Name: followers_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX followers_idx ON public.followers USING btree (follower_id, followee_id);


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
-- Name: posts posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

