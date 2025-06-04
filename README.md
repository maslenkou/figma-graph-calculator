![Main preview image](/github-assets/main-image.png)
<br />
 
# Figma Graph Visualiser
Visualise any math functions by rendering their graphs right on the Figma canvas!
Turn any mathematical expressions and functions into editable Bezier curves in seconds. Simply enter the function you want to visualise (e.g., sin(x+1)*cos(x)^2), press Insert, and enjoy the rendered graph right in your Figma file canvas. 
<br />
 
<!-- ## 🚀  Quick start
<br /> -->

## 👩‍🏫  How to use
Simple as that:
1. Select the frame you want to insert your chart in.
2. Run the plugin.
3. Enter the function you want to visualize.
4. Press the Insert button.
5. Voila.
<br />

## ✍️  Supported input syntax
I work hard to implement the support for every function, expression, and syntax from [math.js](https://mathjs.org/docs/reference/functions.html#trigonometry-functions). Still, not everything works well, but here is a table containing all the supported and tested syntax you can already use:
<table>
  <tbody>
    <tr valign="top">
      <th>
        Syntax
      </th>
      <th>
        Description
      </th>
    </tr>
    <tr valign="top">
      <td>
        sin(x)
      </td>
      <td>
        Sine of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        sinh(x)
      </td>
      <td>
        Hyperbolic sine of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        cos(x)
      </td>
      <td>
        Cosine of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        cosh(x)
      </td>
      <td>
        Hyperbolic cosine of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        tan(x)
      </td>
      <td>
        Tangent of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        tanh(x)
      </td>
      <td>
        Hyperbolic tangent of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        cot(x)
      </td>
      <td>
        Cotangent of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        coth(x)
      </td>
      <td>
        The hyperbolic cotangent of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        random()
      </td>
      <td>
        A random number between 0 and 1
      </td>
    </tr>
    <tr valign="top">
      <td>
        pow(x, y) or x^y
      </td>
      <td>
        X to the power of Y
      </td>
    </tr>
    <tr valign="top">
      <td>
        cube(x)
      </td>
      <td>
        Cube of x (x^3 or x*x*x)
      </td>
    </tr>
    <tr valign="top">
      <td>
        cbrt(x)
      </td>
      <td>
        The cubic root of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        abs(x)
      </td>
      <td>
        The absolute value of x
      </td>
    </tr>
    <tr valign="top">
      <td>
        sqrt(x)
      </td>
      <td>
        Calculate the square root of a value
      </td>
    </tr>
    <tr valign="top">
      <td>
        log(x)
      </td>
      <td>
        Calculate the logarithm of a value
      </td>
    </tr>
    <tr valign="top">
      <td>
        ceil(x)
      </td>
      <td>
        Round a value towards plus infinity
      </td>
    </tr>
    <tr valign="top">
      <td>
        floor(x)
      </td>
      <td>
        Round a value towards minus infinity
      </td>
    </tr>
    <tr valign="top">
      <td>
        round(x)
      </td>
      <td>
        Round a value towards the nearest rounded value
      </td>
    </tr>
    <tr valign="top">
      <td>
        sign(x)
      </td>
      <td>
        Compute the sign of a value
      </td>
    </tr>
    <tr valign="top">
      <td>
        e
      </td>
      <td>
        Euler's number (approx. 2.718)
      </td>
    </tr>
    <tr valign="top">
      <td>
        pi
      </td>
      <td>
        PI (approx. 3.14)
      </td>
    </tr>
  </tbody>
</table>
<br />

## ☹️  Limitations and known issues
A few known issues and limitations:
* Although the plugin can already preview discontinuous and periodical functions like *f(x) = tan(x)* quite all right, it cannot render them properly.
* Not every graph type is rendered and scaled as it should, especially functions with abrupt changes like *f(x) = 1/x*.
<br />

## 🪲  Bug reports or feature requests
If you have a bug report or a feature request, please don’t hesitate to add a new issue, or write a message to my email address or Telegram.
* Email: [ruslan@maslenkou.com](mailto:ruslan@maslenkou.com)
* Telegram: [@maslenkou](t.me/maslenkou)
<br />

## 🫡  Support
My best reward and motivation are you giving this project a star ⭐️ or contributing to its development.
<br />

 
## 👩‍⚖️  Licensing
This project is licensed under the MIT License. See the [LICENSE](https://github.com/maslenkou/figma-graph-calculator/blob/main/LICENSE) file for more details.
