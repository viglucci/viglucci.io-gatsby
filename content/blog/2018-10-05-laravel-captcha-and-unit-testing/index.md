---
title: Handling captcha in Laravel unit testing
slug: laravel-captcha-and-unit-testing
date: "2018-10-05T10:29:00.0000Z"
description: "Considerations when unit testing Laravel applications that use Captchas on forms and HTTP POST requests."
ogimage: "./laravel-og-image.png"
---

*Note: this article references laravel 5.1, or later. Behavior may differ depending on your application's framework version.*

As I've been working on updating an older Laravel application from the dark ages of 4.2 to the newer 5.x (with the help of [Shift](https://laravelshift.com/)), the lack of unit tests in the application has drastically decreased confidence in the migration(s) and slowed me down tremendously. So with that, I've been making an effort to increase the unit test coverage of the application, along with making refactors to make the application more testable, and thus hopefully more reliable. Though, it hasn't been smoothing sailing all of the ways.

One of the issues I recently ran into was how to deal with captcha validation when working with Laravels built in [Application Testing](https://laravel.com/docs/5.1/testing#application-testing) to write tests for the applications account registration flow.

Most applications that offer an account registration flow employ some type of bot prevention techniques such as the use of a captcha, Google's [reCAPTCHA](https://www.google.com/recaptcha/intro/v3beta.html) being a popular solution. However, for this particular application, we are currently using the [mewebstudio/captcha](https://github.com/mewebstudio/captcha) package.

I was initially stumped on how I could either simulate the user interacting with the captcha field, or disable the captcha functionality during testing, but luckily after looking into [Mockery](https://github.com/mockery/mockery), I was able to come up up with a few solutions that seemed reasonable for bypassing captcha validation in testing scenarios.

## Bind a test double in createApplication

The method I eventually went with was to simply bind a test double to the applications container during tests which would always pass validation.

```php
class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        /**
         * Override captcha binding with a double that always passes.
         */
        $app->bind('captcha', function($app)
        {
            $mockCaptcha = Mockery::mock(Mews\Captcha\Captcha::class);

            $mockCaptcha
                ->allows()
                ->img()
                ->andReturn('');

            $mockCaptcha
                ->allows()
                ->check('12345')
                ->andReturn(true);

            return $mockCaptcha;
        });

        return $app;
    }
}
```

Based on the internal workings of the captcha library we are using here, this requires that the double we bind to the container expect that the `img()` method and the `check()` method will be invoked, and for the `check()` method to return true when provided with some expected input.

Once we have our double registered with the applications container, we can now write a test that visits our applications registration page, fills in the form inputs, and then submits the form request.

```php
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\DatabaseTransactions;

class UserRegistrationTest extends TestCase
{

    use DatabaseMigrations;
    use DatabaseTransactions;

    /**
     * @test
     * @return void
     */
    public function redirected_to_login_page_after_good_registration()
    {
        $this->visit('/register')
            ->type('TestUserName', 'username')
            ->type('testemail@localhost.com', 'email')
            ->type('testemail@localhost.com', 'email_confirmation')
            ->type('testpassword', 'password')
            ->type('testpassword', 'password_confirmation')
            ->type('12345', 'captcha')
            ->press('Submit')
            ->seePageIs('/login')
            ->see('Thank you for registering.');
    }
}
```

## Overriding the captcha validator

As an alternative to registering a test double with the applications container, we could simply override the applications captcha validation rule to always return true, thus passing validation.

```php
class TestCase extends Illuminate\Foundation\Testing\TestCase
{
    /**
     * Creates the application.
     *
     * @return \Illuminate\Foundation\Application
     */
    public function createApplication()
    {
        $app = require __DIR__.'/../bootstrap/app.php';

        $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

        /**
         * Override the validation captcha extension to always return true.
         */
        $app['validator']->extend('captcha', function()
        {
            fwrite(STDOUT, print_r('Bypassing captcha validation and returning explicit true!', TRUE));
            return true;
        });

        return $app;
    }
}
```

Although this method works just as well as the previous, I believe that I prefer the original method over the later. The reason is that although we are not making use of any of Mockery's API to assert on the state of the test double during my tests, we lose the ability to inspect what happened to the object during the test, should you wish to do so.

## Closing thoughts

Neither of these solutions are entirely clean as they both require essentially disabling functionality which would ideally be confirmed to be rock solid, and a crucial part of your applications feature set, however, if we agree that would rather have these tests with some imperfections, rather than no tests for the user registration flow at all, they will suffice for now.

Do you have a better way to mock/bypass captcha during testing scenarios? Let me know in the comments below!
