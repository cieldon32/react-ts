// import type  * as ExportsType from "./ReactFeatureFlags.native-fb-dynamic";
// import type  * as DynamicFlagsType from "ReactNativeInternalFeatureFlags";
// In xplat, these flags are controlled by GKs. Because most GKs have some
// population running in either mode, we should run our tests that way, too,
//
// Use __VARIANT__ to simulate a GK. The tests will be run twice: once
// with the __VARIANT__ set to `true`, and once set to `false`.
//
// TODO: __VARIANT__ isn't supported for React Native flags yet. You can set the
// flag here but it won't be set to `true` in any of our test runs. Need to
// update the test configuration.
export const enablePersistentOffscreenHostContainer = __VARIANT__;
// Flow magic to verify the exports of this file match the original version.
// eslint-disable-next-line no-unused-vars
// type Check<_X, Y extends _X, X extends Y = _X> = null;
// eslint-disable-next-line no-unused-expressions
// (null as Check<ExportsType, DynamicFlagsType>);
