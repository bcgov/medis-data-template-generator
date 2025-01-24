# Deployment on Openshift

This application is deployed on Openshift. This readme will outline how to setup and configure an Openshift project to get the application to a deployable state. This document assumes a working knowledge of Kubernetes/Openshift container orchestration concepts (i.e. buildconfigs, deployments, imagestreams, secrets, configmaps, routes, networkpolicies, etc) and Red Hat SSO authentication.

This application does not utilize GitHub Actions for CI/CD but direct operations on OpenShift.

## Table of Contents

- [Openshift Deployment Prerequisites](#openshift-deployment-prerequisites)
- [Environment Setup - ConfigMaps and Secrets](#environment-setup---configmaps-and-secrets)
- [Deployment](#deployment)

## Openshift Deployment Prerequisites

We assume you are logged into OpenShift.

### Add Default Kubernetes Network Policies

Before deploying, ensure that you have the following Network Policies:
-  `allow-from-openshift-ingress` copying the YAML from [allow-from-openshift-ingress](./allow-from-openshift-ingress.np.yaml) 
-  `allow-frontend-to-backend` copying the YAML from [allow-frontend-to-backend](./allow-frontend-to-backend.np.yaml) 

In the "Create NetworkPolicy" page.

### Minio Deployment

The application utilizes MinIO for storing user-uploaded templates for processing. ELMSD provides a comprehensive guide on how to deploy a MinIO instance [MinIO Deployment Guide](https://github.com/bcgov/elmsd-nodejs/tree/main/packages/openshift/templates/minio).

Once deployed, create a new private Bucket and create Access Key associated to that bucket, this guide can be followed to successfully create a Bucket and Access Key [MinIO Bucket and Access Key guide](https://min.io/docs/minio/linux/administration/identity-access-management/minio-user-management.html#access-keys)

You should be able to fill out the following ENVs after the guide above:

```
MINIO_ENDPOINT:
MINIO_ACCESS_KEY:
MINIO_SECRET_KEY:
MINIO_BUCKET:
MINIO_REGION:
```

## Environment Setup - ConfigMaps and Secrets

There are some requirements in the target Openshift namespace/project which are **outside** of the CI/CD pipeline process. This application requires that a few Secrets as well as ConfigMaps are already present in the environment before it is able to function as intended. Otherwise the pipeline will fail the deployment by design.

### ConfigMaps

Go to the +Add screen in OpenShift and copy all from [cm](./cm.yaml), and add the appropriate values left empty under each data section. These values can be collected from your Keycloak SSO provider.

### Secrets

Go to the +Add screen in OpenShift and copy all from [secret](./secret.yaml), and add the appropriate values left empty under each data section. These values can be collected from your Keycloak SSO provider and CHEFS forms we're utilizing for template generation.

## Deployment

This application is currently designed as 2 microservices deployment, a frontend and a backend. It will host a static frontend containing all of the Vue.js resources and assets using Nginx, and a Node.js backend which serves the API that the frontend requires. 

### Builds

This is a small scale application, we're utilizing the OpenShift build mechanics, copy the value from [bc](./bc.yaml) into the +Add screen on your Tools namespace. This will have to be repeated for DEV, TEST and PROD. Once these BuildConfigs are created, new builds can be created from the Builds screen on your Tools namespace. 

### Application

The backend is a standard [Node](https://nodejs.org)/[Express](https://expressjs.com) server. It handles the JWT based authentication via OIDC authentication flow, and exposes the API to authorized users. This deployment container is built up on top of an Alpine Node image. The resulting container after build is what is deployed.

Go to the +Add screen in OpenShift and copy all from [frontend.d](./frontend.d.yaml), using the copy and replace, replace the following values with the value described:

- ${{ IMAGE_TAG }}: the image tag
- ${{ ENVIRONMENT }}: the environment you're deploying to
- ${{ TOOLS_NAMESPACE }}: the tools namespace name

Repeat the process for [backend.d](./backend.d.yaml)