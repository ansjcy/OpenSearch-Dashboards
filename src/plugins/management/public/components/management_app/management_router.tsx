/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import React, { memo } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { EuiPageBody } from '@elastic/eui';
import { AppMountParameters, ChromeBreadcrumb, ScopedHistory } from 'opensearch-dashboards/public';
import { ManagementAppWrapper } from '../management_app_wrapper';
import { ManagementLandingPage } from '../landing';
import { ManagementAppDependencies } from './management_app';
import { ManagementSection } from '../../utils';

interface ManagementRouterProps {
  history: AppMountParameters['history'];
  dependencies: ManagementAppDependencies;
  setBreadcrumbs: (crumbs?: ChromeBreadcrumb[], appHistory?: ScopedHistory) => void;
  onAppMounted: (id: string) => void;
  sections: ManagementSection[];
}

export const ManagementRouter = memo(
  ({ dependencies, history, setBreadcrumbs, onAppMounted, sections }: ManagementRouterProps) => {
    const useUpdatedUX = dependencies.uiSettings.get('home:useNewHomePage');
    return (
      <Router history={history}>
        <EuiPageBody
          component="main"
          restrictWidth={false}
          className="mgtPage__body"
          style={useUpdatedUX ? { maxWidth: 'unset' } : {}}
        >
          <Switch>
            {sections.map((section) =>
              section
                .getAppsEnabled()
                .map((app) => (
                  <Route
                    path={`${app.basePath}`}
                    component={() => (
                      <ManagementAppWrapper
                        app={app}
                        setBreadcrumbs={setBreadcrumbs}
                        onAppMounted={onAppMounted}
                        history={history}
                      />
                    )}
                  />
                ))
            )}
            <Route
              path={'/'}
              component={() => (
                <ManagementLandingPage
                  version={dependencies.opensearchDashboardsVersion}
                  setBreadcrumbs={setBreadcrumbs}
                />
              )}
            />
          </Switch>
        </EuiPageBody>
      </Router>
    );
  }
);
